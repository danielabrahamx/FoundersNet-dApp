# FoundersNet Deployment Guide

This guide covers deploying the FoundersNet Anchor program and connecting it to the React frontend.

## Prerequisites

### System Requirements
- macOS, Linux, or Windows WSL2
- 8GB RAM minimum
- Rust toolchain >= 1.70
- Node.js >= 18

### Install Required Tools

#### 1. Rust
```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source $HOME/.cargo/env
```

#### 2. Solana CLI
```bash
sh -c "$(curl -sSfL https://release.solana.com/v1.18.0/install)"
```

#### 3. Anchor Framework
```bash
cargo install --git https://github.com/coral-xyz/anchor --tag v0.29.0 anchor-cli --locked
```

#### 4. Verify Installation
```bash
solana --version          # Should show v1.18.0
anchor --version          # Should show v0.29.0
rustc --version          # Should show 1.70+
cargo --version          # Should show latest version
```

## Devnet Deployment

### Step 1: Configure Solana for Devnet
```bash
solana config set --url https://api.devnet.solana.com
```

### Step 2: Create a Keypair
If you don't have a keypair yet:
```bash
solana-keygen new -o ~/.config/solana/devnet.json --no-passphrase
```

### Step 3: Fund Your Account
Get airdrop SOL for deployment fees:
```bash
solana airdrop 2 ~/.config/solana/devnet.json
solana balance
```

### Step 4: Build the Program
```bash
cd /path/to/foundersnet
anchor build
```

Expected output:
- Compiled program: `target/deploy/foundersnet.so`
- IDL: `target/idl/foundersnet.json`

### Step 5: Deploy to Devnet
```bash
anchor deploy --provider.cluster devnet
```

This will output:
```
Program deployed to: <PROGRAM_ID>
```

### Step 6: Update Frontend Configuration

Update `/client/.env`:
```env
VITE_PROGRAM_ID=<PROGRAM_ID_FROM_STEP_5>
VITE_SOLANA_NETWORK=devnet
VITE_SOLANA_RPC_ENDPOINT=https://api.devnet.solana.com
VITE_ADMIN_WALLET=78BDAjB4oTdjS4S734Ge2sRWWnHGDDJmPigbp27bSQ7g
```

### Step 7: Update Frontend IDL

Copy the generated IDL to the frontend:
```bash
cp target/idl/foundersnet.json client/src/idl/foundersnet.ts
```

Then update `client/src/idl/foundersnet.ts` to export the IDL as shown in the code structure.

### Step 8: Build and Run Frontend
```bash
cd client
npm install
npm run dev
```

Access the app at `http://localhost:5173`

## Testnet Deployment

### Step 1: Configure Solana for Testnet
```bash
solana config set --url https://api.testnet.solana.com
solana airdrop 2
```

### Step 2: Deploy to Testnet
```bash
anchor deploy --provider.cluster testnet
```

### Step 3: Update `.env` Files
Update the following files with the new program ID:
- `/client/.env` - Update `VITE_PROGRAM_ID`
- `Anchor.toml` - Update if cluster is changed

## Mainnet Deployment

⚠️ **WARNING**: Mainnet deploys are permanent and involve real SOL. Test thoroughly on Devnet first.

### Step 1: Configure Solana for Mainnet
```bash
solana config set --url https://api.mainnet-beta.solana.com
```

### Step 2: Ensure Sufficient Funds
Check your balance:
```bash
solana balance
```

You need approximately 2-3 SOL for deployment fees.

### Step 3: Deploy to Mainnet
```bash
anchor deploy --provider.cluster mainnet-beta
```

### Step 4: Save the Program ID
```bash
# Save to Anchor.toml and environment
export PROGRAM_ID=<YOUR_PROGRAM_ID>
```

### Step 5: Update All Production Configurations
- Frontend `.env`
- Production deployment scripts
- Documentation

### Step 6: Verify Deployment
```bash
solana program info <PROGRAM_ID>
```

## Verification Steps

After deployment, verify everything works:

### 1. Check Program Status
```bash
solana program info <PROGRAM_ID>
```

Should show:
- Authority: Your wallet
- Program ID
- Executable: Yes

### 2. Test IDL Format
```bash
# Verify IDL can be loaded by Anchor
anchor idl fetch <PROGRAM_ID> -o test-idl.json
```

### 3. Test Frontend Connection
1. Start the development server
2. Connect your Devnet wallet (Phantom, Solflare, etc.)
3. Check browser console for no errors
4. Verify you can:
   - View markets
   - Create a test event (if admin)
   - Place a test bet
   - Check your portfolio

### 4. Check Blockchain Transactions
Use Solscan to verify transactions:
```
https://solscan.io/tx/<TRANSACTION_SIGNATURE>?cluster=devnet
```

## Troubleshooting

### Build Failures

#### "error: failed to locate Solana installation"
Install Solana CLI and ensure it's in your PATH:
```bash
export PATH="/home/user/.local/share/solana/install/active_release/bin:$PATH"
```

#### "error: failed to build program"
Ensure Rust toolchain is up to date:
```bash
rustup update
cargo update
```

### Deployment Failures

#### "InsufficientFundsForFee"
Get more SOL via airdrop:
```bash
solana airdrop 2
```

#### "Invalid keypair"
Regenerate keypair:
```bash
solana-keygen new --force
solana airdrop 2
```

### IDL Issues

#### "No IDL found for program"
Ensure IDL was generated during build:
```bash
anchor build --idl target/idl/foundersnet.json
```

#### IDL Mismatch with Frontend
Regenerate and copy the IDL:
```bash
anchor build
cp target/idl/foundersnet.json client/src/idl/foundersnet.ts
```

### Frontend Connection Issues

#### "Program account does not exist"
Ensure:
- Program ID is correct in `.env`
- Program is actually deployed
- RPC endpoint is correct

#### "Wallet not connected"
Ensure:
- Wallet adapter is configured
- Wallet matches deployment network
- Network is set to Devnet/Testnet/Mainnet

## File Structure After Deployment

```
foundersnet/
├── programs/
│   └── foundersnet/
│       ├── src/
│       │   └── lib.rs           (Anchor program)
│       └── target/
│           ├── deploy/
│           │   └── foundersnet.so
│           └── idl/
│               └── foundersnet.json
├── client/
│   ├── src/
│   │   └── idl/
│   │       └── foundersnet.ts   (Updated IDL)
│   ├── .env                     (Updated PROGRAM_ID)
│   └── dist/                    (Built frontend)
└── DEPLOYMENT.md                (This file)
```

## Environment Variables

### Frontend (.env)
```env
# Program Configuration
VITE_PROGRAM_ID=<DEPLOYED_PROGRAM_ID>

# Solana Configuration
VITE_SOLANA_NETWORK=devnet
VITE_SOLANA_RPC_ENDPOINT=https://api.devnet.solana.com

# Admin Configuration
VITE_ADMIN_WALLET=78BDAjB4oTdjS4S734Ge2sRWWnHGDDJmPigbp27bSQ7g
```

### Anchor Configuration (Anchor.toml)
```toml
[provider]
cluster = "Devnet"  # or "Testnet", "Mainnet"

[programs.devnet]
foundersnet = "<PROGRAM_ID>"
```

## Monitoring

### Check Recent Transactions
```bash
solana transaction-history <YOUR_WALLET> -l 10
```

### Monitor Program Invocations
```bash
solana logs <PROGRAM_ID>
```

### View Account Data
```bash
solana account <ACCOUNT_ADDRESS> --output json
```

## Next Steps

1. **Frontend Testing**: Run full integration tests with actual program
2. **User Testing**: Have beta users test on Devnet
3. **Security Audit**: Consider auditing the program before Mainnet
4. **Documentation**: Update user-facing docs with deployment info
5. **CI/CD**: Set up automated deployment pipeline

## Support

For issues:
1. Check Anchor documentation: https://www.anchor-lang.com/
2. Check Solana documentation: https://docs.solana.com/
3. Check browser console for frontend errors
4. Check Solscan for transaction details

## Security Reminders

- ✅ Never commit private keys
- ✅ Use a secure keypair for production
- ✅ Test thoroughly on Devnet before Mainnet
- ✅ Monitor all transactions
- ✅ Keep wallet backup secured
- ✅ Verify program authority is secure
