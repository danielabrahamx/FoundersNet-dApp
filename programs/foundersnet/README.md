# FoundersNet Anchor Program

A complete Solana Anchor program implementing a prediction event marketplace for startup fundraising outcomes.

## Overview

The FoundersNet program manages a decentralized prediction market where users can:
- Create prediction events for startup fundraising activities (Series A, Series B, Acquisitions, IPOs)
- Place bets on YES or NO outcomes (one bet per event per user)
- Admins resolve events with final outcomes
- Winners claim their winnings from the resolved events

All state is stored entirely on-chain with no backend required.

## Features

### 1. Event Management
- **Create Events**: Admin or users create new prediction events with:
  - Title, description, and category
  - Event type (Series A, Series B, Acquisition, IPO, Other)
  - Resolution date (Unix timestamp)
  - Optional startup name
  - Initial liquidity (minimum 0.5 SOL)
- **Fetch Events**: Retrieve all events or a specific event
- **Event Status**: OPEN (accepting bets) or RESOLVED (outcome determined)

### 2. Betting System
- **Place Bets**: Users can place bets on YES or NO outcomes
- **Minimum Bet**: 0.01 SOL
- **One Bet Per Event**: Enforced on-chain - users can only have one position per event
- **Pool Management**: Bets contribute to YES and NO pools
- **Entry Price**: Calculated based on current pool distribution

### 3. Pool Management
- Maintains YES and NO liquidity pools for each event
- Pools updated with each bet placed
- Tracks total volume of all bets
- Supports automatic pool distribution calculation

### 4. Event Resolution (Admin Only)
- Admin-only instruction to resolve events
- Outcomes: YES, NO, or INVALID
- Only admin wallet (78BDAjB4oTdjS4S734Ge2sRWWnHGDDJmPigbp27bSQ7g) can resolve
- Emits resolution event for off-chain tracking

### 5. Winning Claims
- Users can claim winnings from resolved events
- Payout calculation:
  - **For winners**: Original bet + share of losing pool
  - **For invalid outcomes**: Original bet returned
  - **For losers**: No payout (0 SOL)
- One-time claim per position (prevents double claiming)
- SOL transferred directly to winner's wallet

## Program Structure

### Accounts

#### Market Account
```rust
pub struct Market {
    pub title: String,              // Event title (10-200 chars)
    pub description: String,        // Event description (50-1000 chars)
    pub category: u8,               // Market category
    pub event_type: u8,             // Fundraising event type (0-4)
    pub startup_name: String,       // Optional startup name
    pub resolution_date: i64,       // Unix timestamp for resolution
    pub creator: Pubkey,            // Event creator
    pub resolver: Pubkey,           // Admin resolver
    pub yes_pool: u64,              // YES pool size (lamports)
    pub no_pool: u64,               // NO pool size (lamports)
    pub total_volume: u64,          // Total bet volume (lamports)
    pub status: u8,                 // 0=OPEN, 1=RESOLVED
    pub outcome: Option<u8>,        // 0=YES, 1=NO, 2=INVALID
    pub created_at: i64,            // Creation timestamp
    pub claimed_for_resolution: bool // Future use
}
```

#### UserPosition Account
```rust
pub struct UserPosition {
    pub user: Pubkey,               // User's wallet
    pub market: Pubkey,             // Associated market
    pub yes_shares: u64,            // YES shares (lamports bet)
    pub no_shares: u64,             // NO shares (lamports bet)
    pub total_cost: u64,            // Total bet amount
    pub last_trade_at: i64,         // Last trade timestamp
    pub claimed: bool               // Has user claimed winnings?
}
```

### Instructions

#### 1. create_market
Creates a new prediction event.

**Parameters:**
- `title`: Event title (10-200 characters)
- `description`: Event description (50-1000 characters)
- `event_type`: Fundraising type (0-4)
- `startup_name`: Optional startup name
- `resolution_date`: Unix timestamp for resolution
- `initial_liquidity`: Initial liquidity in lamports (min 0.5 SOL)

**Accounts:**
- `market` - New market account (signer, mutable, initialized)
- `creator` - Event creator (signer, mutable, pays fees)
- `system_program` - Solana system program

**Validations:**
- Title length: 10-200 characters
- Description length: 50-1000 characters
- Initial liquidity: >= 0.5 SOL (50,000,000 lamports)
- Resolution date: Must be in the future

**Returns:** MarketCreated event with market public key

#### 2. place_bet
Place a bet on a market outcome.

**Parameters:**
- `amount`: Bet amount in lamports (min 0.01 SOL)
- `outcome`: BetOutcome::Yes or BetOutcome::No

**Accounts:**
- `market` - Market to bet on (mutable)
- `user_position` - User's position account (PDA, mutable, created if needed)
- `user` - Bet placer (signer, mutable)
- `system_program` - Solana system program

**PDA Seeds:** `["user_position", user_pubkey, market_pubkey]`

**Validations:**
- Bet amount: >= 0.01 SOL (1,000,000 lamports)
- Market status: OPEN
- Resolution date: Not passed
- User position: No existing position on this event (one bet per event)

**Returns:** BetPlaced event

#### 3. resolve_market
Resolve an event with final outcome (admin only).

**Parameters:**
- `outcome`: MarketOutcome::Yes, MarketOutcome::No, or MarketOutcome::Invalid

**Accounts:**
- `market` - Market to resolve (mutable)
- `resolver` - Admin wallet (signer)

**Validations:**
- Resolver: Must be admin wallet (78BDAjB4oTdjS4S734Ge2sRWWnHGDDJmPigbp27bSQ7g)
- Market status: Must be OPEN

**Returns:** MarketResolved event

#### 4. claim_winnings
Claim winnings from a resolved event.

**Parameters:** None

**Accounts:**
- `market` - Resolved market (mutable)
- `user_position` - User's position (PDA, mutable)
- `user` - Winner (signer, mutable)

**Validations:**
- Market status: RESOLVED
- Position claimed: Not previously claimed
- Has winnings: Must have won or outcome invalid

**Returns:** WinningsClaimed event with payout amount

## Events

All events are emitted for off-chain tracking:

### MarketCreated
```rust
pub struct MarketCreated {
    pub market: Pubkey,
    pub creator: Pubkey,
    pub title: String,
}
```

### BetPlaced
```rust
pub struct BetPlaced {
    pub market: Pubkey,
    pub user: Pubkey,
    pub amount: u64,
    pub outcome: u8, // 0=YES, 1=NO
}
```

### MarketResolved
```rust
pub struct MarketResolved {
    pub market: Pubkey,
    pub resolver: Pubkey,
    pub outcome: u8, // 0=YES, 1=NO, 2=INVALID
}
```

### WinningsClaimed
```rust
pub struct WinningsClaimed {
    pub market: Pubkey,
    pub user: Pubkey,
    pub payout: u64,
}
```

## Error Codes

| Code | Name | Description |
|------|------|-------------|
| 6000 | InvalidTitleLength | Title must be 10-200 characters |
| 6001 | InvalidDescriptionLength | Description must be 50-1000 characters |
| 6002 | InsufficientInitialLiquidity | Initial liquidity must be >= 0.5 SOL |
| 6003 | ResolutionDateInPast | Resolution date must be in the future |
| 6004 | BelowMinimumBetAmount | Bet amount must be >= 0.01 SOL |
| 6005 | MarketNotOpen | Market must be in OPEN status |
| 6006 | ResolutionDatePassed | Cannot bet after resolution date |
| 6007 | AlreadyBetOnEvent | User has already bet on this event |
| 6008 | MarketAlreadyResolved | Market is already resolved |
| 6009 | UnauthorizedResolver | Only admin can resolve events |
| 6010 | MarketNotResolved | Market must be resolved to claim |
| 6011 | AlreadyClaimed | Winnings already claimed for this position |
| 6012 | NoWinnings | No winnings available for this outcome |
| 6013 | ArithmeticOverflow | Arithmetic operation overflow |

## Constants

- **Admin Wallet**: `78BDAjB4oTdjS4S734Ge2sRWWnHGDDJmPigbp27bSQ7g`
- **Min Bet Amount**: 0.01 SOL (1,000,000 lamports)
- **Min Initial Liquidity**: 0.5 SOL (50,000,000 lamports)
- **1 SOL**: 1,000,000,000 lamports

## Building the Program

### Prerequisites
- Rust >= 1.70
- Solana CLI
- Anchor CLI

### Build
```bash
anchor build
```

This generates:
- Compiled program: `target/deploy/foundersnet.so`
- IDL: `target/idl/foundersnet.json`

### Deploy to Devnet
```bash
anchor deploy --provider.cluster devnet
```

This outputs the program ID, which should be saved to:
- Frontend `.env`: `VITE_PROGRAM_ID=<program_id>`
- Update IDL at `client/src/idl/foundersnet.ts` with generated IDL

### Deploy to Testnet
```bash
solana config set --url https://api.testnet.solana.com
anchor deploy --provider.cluster testnet
```

## Testing

Run the test suite:
```bash
anchor test
```

## Frontend Integration

The generated IDL must be placed at `/client/src/idl/foundersnet.ts` for the frontend to function.

The frontend expects:
- Program ID in `VITE_PROGRAM_ID` environment variable
- Matching IDL structure
- All instructions as defined

Frontend hooks automatically generate the correct account layouts and PDAs.

## Security Considerations

1. **One Bet Per Event**: Enforced on-chain via PDA seed structure
2. **Admin Control**: Only authorized admin wallet can resolve events
3. **No Double Claims**: Positions marked as claimed to prevent re-entry
4. **Arithmetic Safety**: All operations checked for overflow
5. **Validation**: All inputs validated before account mutations
6. **Account Ownership**: Accounts verified to prevent unauthorized access

## Performance

- Account size optimized for Solana's 10 MB limit
- Efficient PDA structure for quick lookups
- Direct SOL transfers minimize cross-program calls
- Lazy account initialization for position accounts

## Future Enhancements

1. Pool rebalancing mechanisms
2. Liquidity provider rewards
3. Advanced betting options (limit orders, etc.)
4. Event dispute resolution
5. Multi-admin support
6. Partial liquidity withdrawal
7. Volume-based fee structure

## License

MIT
