# FoundersNet Quick Start Guide

Get the FoundersNet prediction market up and running in 5 minutes.

## What is FoundersNet?

FoundersNet is a decentralized prediction market for startup fundraising events built on Solana. Users predict outcomes (YES/NO) for Series A, Series B, Acquisitions, and IPOs, placing bets on their predictions.

**Key Features:**
- One bet per event per user
- Admin-controlled event resolution
- Automated payout calculation
- All state stored on-chain
- No backend required

## Prerequisites

- Phantom, Solflare, or Trust wallet connected to Devnet
- Devnet SOL (request via faucet)
- Node.js >= 18

## Option 1: Using Deployed Program (Fastest)

### 1. Get the Deployment Info

Contact the FoundersNet team for:
- Program ID
- RPC endpoint

### 2. Setup Frontend

```bash
cd client
npm install
```

### 3. Create .env File

```bash
cp .env.example .env
```

Edit `.env`:
```env
VITE_SOLANA_NETWORK=devnet
VITE_SOLANA_RPC_ENDPOINT=https://api.devnet.solana.com
VITE_PROGRAM_ID=<DEPLOYED_PROGRAM_ID>
VITE_ADMIN_WALLET=78BDAjB4oTdjS4S734Ge2sRWWnHGDDJmPigbp27bSQ7g
```

### 4. Start App

```bash
npm run dev
```

Open http://localhost:5173 and connect your wallet!

## Option 2: Full Development Setup (Build & Deploy)

### 1. Install Tools

```bash
# Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Solana CLI
sh -c "$(curl -sSfL https://release.solana.com/v1.18.0/install)"

# Anchor
cargo install --git https://github.com/coral-xyz/anchor --tag v0.29.0 anchor-cli --locked
```

### 2. Configure Solana

```bash
solana config set --url https://api.devnet.solana.com
solana-keygen new -o ~/.config/solana/devnet.json --no-passphrase
solana airdrop 2 -k ~/.config/solana/devnet.json
```

### 3. Build & Deploy Program

```bash
# From project root
anchor build
anchor deploy --provider.cluster devnet
```

Save the program ID from the output.

### 4. Setup Frontend

```bash
cd client
npm install
cp .env.example .env
```

Edit `.env` with your new program ID.

### 5. Start App

```bash
npm run dev
```

## Using the App

### As a Regular User

1. **Connect Wallet**: Click "Connect" button, select your wallet
2. **View Markets**: See all available prediction events
3. **Place Bet**: 
   - Click on an event
   - Enter bet amount (min 0.01 SOL)
   - Choose YES or NO
   - Confirm transaction
4. **View Portfolio**: See your positions and winnings
5. **Claim Winnings**: After event resolves, claim your winnings

### As Admin

1. **Access Admin Panel**: `/admin` route (requires admin wallet)
2. **Create Event**: Fill in event details:
   - Startup name
   - Event type (Series A, B, Acquisition, IPO, Other)
   - Description
   - Resolution date
   - Initial liquidity (min 0.5 SOL)
3. **Resolve Event**: After event date:
   - Go to event detail
   - Click "Resolve Event"
   - Choose outcome (YES/NO/INVALID)
   - Confirm transaction

## Architecture

```
User → React Frontend → Anchor Program → Solana Blockchain
                           ↓
                    Smart Contract State
                    (Markets, Positions, Pools)
```

## Key Concepts

### Markets (Events)
- Fundraising prediction events
- Status: OPEN (accepting bets) or RESOLVED (outcome determined)
- Pools: YES pool and NO pool
- Resolution date: When the real outcome is known

### Positions (Bets)
- One per user per event
- Tracks user's bet amount and outcome
- Marked as claimed when winnings are claimed

### Pools
- YES pool: All bets on YES outcome
- NO pool: All bets on NO outcome
- Used to calculate odds and payouts

### Payouts
- **You won**: Original bet + share of losing pool
- **Invalid outcome**: Original bet returned
- **You lost**: 0 (no payout)

## Common Tasks

### Check Account Balance
- Connected wallet shows balance in header
- Balances update automatically

### View All Positions
- Click "Portfolio" tab
- See all your active and resolved positions

### Resolve Event (Admin Only)
1. Click event to view detail
2. If date passed and market OPEN, see "Resolve Event" button
3. Click button, choose outcome
4. Transaction confirms resolution

### Claim Winnings (Winners)
1. View Portfolio
2. Find resolved event you won
3. Click "Claim Winnings"
4. Winnings transferred to your wallet

### Create New Event (Admin Only)
1. Click "Admin" tab
2. Fill in event form:
   - Startup name (e.g., "TechCorp")
   - Type (Series A/B/Acquisition/IPO/Other)
   - Description
   - Resolution date (future date)
   - Initial liquidity (min 0.5 SOL)
3. Click Create
4. Event appears in markets list

## Network Info

**Devnet**
- Network: Solana Devnet
- Explorer: https://solscan.io/?cluster=devnet
- Faucet: Use Phantom wallet or `solana airdrop 2`
- RPC: https://api.devnet.solana.com

## Troubleshooting

### Wallet Won't Connect
- Ensure wallet is on Devnet
- Refresh page
- Try different wallet (Phantom, Solflare)

### "Insufficient balance"
- Request SOL airdrop: `solana airdrop 2`
- Or use Phantom wallet's built-in faucet

### Can't place bet
- Ensure you haven't already bet on this event
- Bet amount must be >= 0.01 SOL
- Event must be OPEN (not resolved)

### Can't create event (not admin)
- Only admin wallet can create events
- Admin wallet: `78BDAjB4oTdjS4S734Ge2sRWWnHGDDJmPigbp27bSQ7g`

### Program account doesn't exist
- Ensure VITE_PROGRAM_ID is correct
- Program must be deployed
- Using correct RPC endpoint

## File Structure

After setup:
```
foundersnet/
├── programs/foundersnet/          # Anchor program (Rust)
├── client/                         # React frontend (TypeScript)
├── DEPLOYMENT.md                   # Deployment guide
├── DEVELOPMENT.md                  # Development guide
└── QUICKSTART.md                   # This file
```

## Next Steps

1. **Join Community**: Connect with other users
2. **Create First Event**: If admin, create a test event
3. **Place Bets**: Predict outcomes
4. **Monitor Events**: Track your positions
5. **Claim Winnings**: Collect your rewards

## Important Notes

⚠️ **Devnet Only**: This is a development environment. DO NOT use real funds.

⚠️ **One Bet Per Event**: You can only bet once per event per outcome.

⚠️ **Admin Control**: Only the admin wallet can resolve events. Ensure this wallet is secure.

## Get Help

### Documentation
- [Deployment Guide](./DEPLOYMENT.md) - Deploy to Devnet/Testnet/Mainnet
- [Development Guide](./DEVELOPMENT.md) - Modify code and extend features
- [Program README](./programs/foundersnet/README.md) - Program technical details

### External Resources
- [Anchor Documentation](https://www.anchor-lang.com/)
- [Solana Documentation](https://docs.solana.com/)
- [Phantom Wallet](https://phantom.app/)

## Running Your First Bet

1. **Connect Wallet**: Click "Connect" → Select wallet → Approve
2. **View Event**: Click on any market
3. **Place Bet**: 
   ```
   Amount: 0.1 SOL
   Outcome: YES
   ```
4. **Confirm**: Sign transaction in wallet
5. **Wait**: Transaction processes (5-10 seconds)
6. **Done**: Your bet is recorded on blockchain!

## What Happens Next

- **Before Resolution Date**: More users place bets, pools grow
- **At Resolution Date**: Admin resolves with actual outcome
- **Winners**: Can claim winnings
- **Losers**: Can see their loss
- **Cycle Continues**: New events created, new predictions made

Enjoy predicting! 🚀
