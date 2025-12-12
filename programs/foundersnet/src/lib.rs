use anchor_lang::prelude::*;
use anchor_lang::system_program::{transfer, Transfer};
use std::mem::size_of;

declare_id!("245syyVU4A1jY1Qa7K9PLnpcAE9Kv1qcj5J51hm5gKhd");

#[program]
pub mod foundersnet {
    use super::*;

    /// Create a new market/event
    pub fn create_market(
        ctx: Context<CreateMarket>,
        title: String,
        description: String,
        event_type: u8,
        startup_name: String,
        resolution_date: i64,
        initial_liquidity: u64,
    ) -> Result<()> {
        require!(
            title.len() >= 10 && title.len() <= 200,
            FoundersNetError::InvalidTitleLength
        );
        require!(
            description.len() >= 50 && description.len() <= 1000,
            FoundersNetError::InvalidDescriptionLength
        );
        require!(
            initial_liquidity >= 50_000_000, // 0.5 SOL in lamports
            FoundersNetError::InsufficientInitialLiquidity
        );
        require!(
            resolution_date > Clock::get()?.unix_timestamp,
            FoundersNetError::ResolutionDateInPast
        );

        let market = &mut ctx.accounts.market;
        market.title = title;
        market.description = description;
        market.category = 5; // Default category
        market.event_type = event_type;
        market.startup_name = startup_name;
        market.resolution_date = resolution_date;
        market.creator = ctx.accounts.creator.key();
        market.resolver = ctx.accounts.creator.key();
        market.yes_pool = initial_liquidity / 2;
        market.no_pool = initial_liquidity / 2;
        market.total_volume = initial_liquidity;
        market.status = 0; // 0 = OPEN
        market.outcome = None;
        market.created_at = Clock::get()?.unix_timestamp;
        market.claimed_for_resolution = false;

        // Transfer initial liquidity from creator to market
        let cpi_context = CpiContext::new(
            ctx.accounts.system_program.to_account_info(),
            Transfer {
                from: ctx.accounts.creator.to_account_info(),
                to: market.to_account_info(),
            },
        );
        transfer(cpi_context, initial_liquidity)?;

        emit!(MarketCreated {
            market: market.key(),
            creator: market.creator,
            title: market.title.clone(),
        });

        Ok(())
    }

    /// Place a bet on a market
    pub fn place_bet(
        ctx: Context<PlaceBet>,
        amount: u64,
        outcome: BetOutcome,
    ) -> Result<()> {
        require!(
            amount >= 1_000_000, // 0.01 SOL in lamports
            FoundersNetError::BelowMinimumBetAmount
        );

        let market = &mut ctx.accounts.market;

        // Check market status
        require!(
            market.status == 0, // OPEN
            FoundersNetError::MarketNotOpen
        );

        // Check if resolution date has passed
        require!(
            Clock::get()?.unix_timestamp < market.resolution_date,
            FoundersNetError::ResolutionDatePassed
        );

        // Check if user already has a position (one bet per event per user)
        let user_position = &mut ctx.accounts.user_position;
        if user_position.user != Pubkey::default() {
            require!(
                user_position.yes_shares == 0 && user_position.no_shares == 0,
                FoundersNetError::AlreadyBetOnEvent
            );
        }

        // Initialize user position if not already initialized
        if user_position.user == Pubkey::default() {
            user_position.user = ctx.accounts.user.key();
            user_position.market = market.key();
            user_position.yes_shares = 0;
            user_position.no_shares = 0;
            user_position.total_cost = 0;
            user_position.claimed = false;
        }

        // Update pools and position based on outcome
        match outcome {
            BetOutcome::Yes => {
                user_position.yes_shares = amount;
                market.yes_pool = market.yes_pool.checked_add(amount).ok_or(FoundersNetError::ArithmeticOverflow)?;
            }
            BetOutcome::No => {
                user_position.no_shares = amount;
                market.no_pool = market.no_pool.checked_add(amount).ok_or(FoundersNetError::ArithmeticOverflow)?;
            }
        }

        user_position.total_cost = amount;
        user_position.last_trade_at = Clock::get()?.unix_timestamp;
        market.total_volume = market.total_volume.checked_add(amount).ok_or(FoundersNetError::ArithmeticOverflow)?;

        // Transfer SOL from user to market
        let cpi_context = CpiContext::new(
            ctx.accounts.system_program.to_account_info(),
            Transfer {
                from: ctx.accounts.user.to_account_info(),
                to: market.to_account_info(),
            },
        );
        transfer(cpi_context, amount)?;

        emit!(BetPlaced {
            market: market.key(),
            user: ctx.accounts.user.key(),
            amount,
            outcome: match outcome {
                BetOutcome::Yes => 0,
                BetOutcome::No => 1,
            },
        });

        Ok(())
    }

    /// Resolve a market (admin only)
    pub fn resolve_market(
        ctx: Context<ResolveMarket>,
        outcome: MarketOutcome,
    ) -> Result<()> {
        let market = &mut ctx.accounts.market;
        
        // Check if resolver is authorized (either the market's designated resolver or the admin wallet)
        require!(
            ctx.accounts.resolver.key() == market.resolver || ctx.accounts.resolver.key() == ADMIN_WALLET,
            FoundersNetError::UnauthorizedResolver
        );

        require!(
            market.status == 0, // OPEN
            FoundersNetError::MarketAlreadyResolved
        );

        // Allow resolution at any time (early or after resolution date)
        // No additional time check needed - resolution can happen anytime after market is created

        market.status = 1; // RESOLVED
        market.outcome = Some(match outcome {
            MarketOutcome::Yes => 0,
            MarketOutcome::No => 1,
            MarketOutcome::Invalid => 2,
        });

        emit!(MarketResolved {
            market: market.key(),
            resolver: ctx.accounts.resolver.key(),
            outcome: match outcome {
                MarketOutcome::Yes => 0,
                MarketOutcome::No => 1,
                MarketOutcome::Invalid => 2,
            },
        });

        Ok(())
    }

    /// Claim winnings from a resolved market
    pub fn claim_winnings(ctx: Context<ClaimWinnings>) -> Result<()> {
        let market = &ctx.accounts.market;
        let user_position = &mut ctx.accounts.user_position;

        // Check if market is resolved
        require!(
            market.status == 1, // RESOLVED
            FoundersNetError::MarketNotResolved
        );

        // Check if user has already claimed
        require!(
            !user_position.claimed,
            FoundersNetError::AlreadyClaimed
        );

        // Determine payout
        let payout = match market.outcome {
            Some(outcome_value) => {
                if outcome_value == 2 {
                    // Invalid outcome - return original bet
                    user_position.total_cost
                } else if (outcome_value == 0 && user_position.yes_shares > 0)
                    || (outcome_value == 1 && user_position.no_shares > 0)
                {
                    // User won
                    let winning_shares = if outcome_value == 0 {
                        user_position.yes_shares
                    } else {
                        user_position.no_shares
                    };
                    let losing_pool = if outcome_value == 0 {
                        market.no_pool
                    } else {
                        market.yes_pool
                    };

                    // Calculate payout: original bet + share of losing pool
                    let share = if market.total_volume > 0 {
                        (winning_shares as u128)
                            .checked_mul(losing_pool as u128)
                            .ok_or(FoundersNetError::ArithmeticOverflow)?
                            .checked_div(market.total_volume as u128)
                            .ok_or(FoundersNetError::ArithmeticOverflow)? as u64
                    } else {
                        0
                    };
                    user_position
                        .total_cost
                        .checked_add(share)
                        .ok_or(FoundersNetError::ArithmeticOverflow)?
                } else {
                    // User lost or didn't have the right outcome
                    0
                }
            }
            None => return Err(FoundersNetError::MarketNotResolved.into()),
        };

        require!(payout > 0, FoundersNetError::NoWinnings);

        user_position.claimed = true;

        // Transfer winnings from market to user
        **ctx.accounts.market.to_account_info().try_borrow_mut_lamports()? -= payout;
        **ctx.accounts.user.to_account_info().try_borrow_mut_lamports()? += payout;

        emit!(WinningsClaimed {
            market: market.key(),
            user: ctx.accounts.user.key(),
            payout,
        });

        Ok(())
    }
}

// Admin wallet address
// 78BDAjB4oTdjS4S734Ge2sRWWnHGDDJmPigbp27bSQ7g
const ADMIN_WALLET: Pubkey = Pubkey::new_from_array([
    94, 171, 72, 89, 203, 45, 184, 70, 241, 119, 125, 148, 125, 56, 7,
    231, 120, 163, 184, 134, 114, 44, 158, 40, 138, 161, 230, 41, 21, 144, 67, 230
]);

// Events

#[event]
pub struct MarketCreated {
    pub market: Pubkey,
    pub creator: Pubkey,
    pub title: String,
}

#[event]
pub struct BetPlaced {
    pub market: Pubkey,
    pub user: Pubkey,
    pub amount: u64,
    pub outcome: u8,
}

#[event]
pub struct MarketResolved {
    pub market: Pubkey,
    pub resolver: Pubkey,
    pub outcome: u8,
}

#[event]
pub struct WinningsClaimed {
    pub market: Pubkey,
    pub user: Pubkey,
    pub payout: u64,
}

// Instructions

#[derive(Accounts)]
#[instruction(title: String, description: String)]
pub struct CreateMarket<'info> {
    #[account(init, payer = creator, space = 8 + size_of::<Market>() + title.len() + description.len() + 100)]
    pub market: Account<'info, Market>,
    #[account(mut)]
    pub creator: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct PlaceBet<'info> {
    #[account(mut)]
    pub market: Account<'info, Market>,
    #[account(
        init_if_needed,
        payer = user,
        space = 8 + size_of::<UserPosition>(),
        seeds = [b"user_position", user.key().as_ref(), market.key().as_ref()],
        bump
    )]
    pub user_position: Account<'info, UserPosition>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct ResolveMarket<'info> {
    #[account(mut)]
    pub market: Account<'info, Market>,
    pub resolver: Signer<'info>,
}

#[derive(Accounts)]
pub struct ClaimWinnings<'info> {
    #[account(mut)]
    pub market: Account<'info, Market>,
    #[account(
        mut,
        seeds = [b"user_position", user.key().as_ref(), market.key().as_ref()],
        bump
    )]
    pub user_position: Account<'info, UserPosition>,
    #[account(mut)]
    pub user: Signer<'info>,
}

// Accounts

#[account]
pub struct Market {
    pub title: String,
    pub description: String,
    pub category: u8,
    pub event_type: u8,
    pub startup_name: String,
    pub resolution_date: i64,
    pub creator: Pubkey,
    pub resolver: Pubkey,
    pub yes_pool: u64,
    pub no_pool: u64,
    pub total_volume: u64,
    pub status: u8, // 0 = OPEN, 1 = RESOLVED
    pub outcome: Option<u8>, // 0 = YES, 1 = NO, 2 = INVALID
    pub created_at: i64,
    pub claimed_for_resolution: bool,
}

#[account]
pub struct UserPosition {
    pub user: Pubkey,
    pub market: Pubkey,
    pub yes_shares: u64,
    pub no_shares: u64,
    pub total_cost: u64,
    pub last_trade_at: i64,
    pub claimed: bool,
}

// Enums

#[derive(AnchorDeserialize, AnchorSerialize)]
pub enum BetOutcome {
    Yes,
    No,
}

#[derive(AnchorDeserialize, AnchorSerialize)]
pub enum MarketOutcome {
    Yes,
    No,
    Invalid,
}

// Errors

#[error_code]
pub enum FoundersNetError {
    #[msg("Invalid title length")]
    InvalidTitleLength,
    #[msg("Invalid description length")]
    InvalidDescriptionLength,
    #[msg("Insufficient initial liquidity")]
    InsufficientInitialLiquidity,
    #[msg("Resolution date is in the past")]
    ResolutionDateInPast,
    #[msg("Bet amount is below minimum")]
    BelowMinimumBetAmount,
    #[msg("Market is not open")]
    MarketNotOpen,
    #[msg("Resolution date has passed")]
    ResolutionDatePassed,
    #[msg("User has already bet on this event")]
    AlreadyBetOnEvent,
    #[msg("Market is already resolved")]
    MarketAlreadyResolved,
    #[msg("Unauthorized resolver")]
    UnauthorizedResolver,
    #[msg("Market is not resolved")]
    MarketNotResolved,
    #[msg("Winnings already claimed")]
    AlreadyClaimed,
    #[msg("No winnings available")]
    NoWinnings,
    #[msg("Arithmetic overflow")]
    ArithmeticOverflow,
}
