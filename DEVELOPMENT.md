# FoundersNet Development Guide

This guide covers developing and testing the FoundersNet program and frontend.

## Project Structure

```
foundersnet/
├── Anchor.toml                 # Anchor framework configuration
├── Cargo.toml                  # Workspace configuration
├── DEPLOYMENT.md               # Deployment guide
├── DEVELOPMENT.md              # This file
├── programs/
│   └── foundersnet/
│       ├── Cargo.toml         # Program dependencies
│       ├── README.md          # Program documentation
│       └── src/
│           └── lib.rs         # Anchor program implementation
├── client/                     # React frontend
│   ├── src/
│   │   ├── hooks/             # React hooks for blockchain interaction
│   │   ├── components/        # React components
│   │   ├── pages/             # Page components
│   │   ├── lib/               # Utilities
│   │   ├── idl/               # Anchor IDL definitions
│   │   └── types/             # TypeScript interfaces
│   └── package.json
└── tests/                      # Integration tests
```

## Development Workflow

### 1. Setup Development Environment

#### Install Prerequisites
```bash
# Rust and Cargo
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Solana CLI
sh -c "$(curl -sSfL https://release.solana.com/v1.18.0/install)"

# Anchor Framework
cargo install --git https://github.com/coral-xyz/anchor --tag v0.29.0 anchor-cli --locked

# Node.js and npm (if not already installed)
# Visit https://nodejs.org/
```

#### Configure Solana for Local Development
```bash
solana config set --url http://localhost:8899  # Local validator
# or
solana config set --url https://api.devnet.solana.com  # Devnet
```

### 2. Build the Program

```bash
# Build in development mode
anchor build

# Build with optimizations
anchor build --release

# Output:
# - compiled program: target/deploy/foundersnet.so
# - IDL: target/idl/foundersnet.json
```

### 3. Run Tests

```bash
# Run all tests
anchor test

# Run specific test
anchor test --test integration_tests

# Run with logging
RUST_LOG=debug anchor test
```

### 4. Deploy Program

#### Local Development
```bash
# Start local validator
solana-test-validator

# In another terminal, deploy
anchor deploy --provider.cluster localnet
```

#### Devnet
```bash
anchor deploy --provider.cluster devnet
```

### 5. Run Frontend

```bash
cd client

# Install dependencies
npm install

# Create .env file
cp .env.example .env
# Edit .env with your VITE_PROGRAM_ID

# Start dev server
npm run dev
# Access at http://localhost:5173

# Build for production
npm run build

# Run linting
npm run lint

# Check types
npm run type-check
```

## Making Changes to the Program

### Program Structure

The Anchor program is in `programs/foundersnet/src/lib.rs` and contains:

1. **Instructions**: Methods that modify blockchain state
   - `create_market` - Create new event
   - `place_bet` - Place bet on event
   - `resolve_market` - Resolve event (admin)
   - `claim_winnings` - Claim winnings

2. **Accounts**: On-chain data structures
   - `Market` - Event account
   - `UserPosition` - User's position on an event

3. **Events**: Off-chain tracking
   - `MarketCreated`
   - `BetPlaced`
   - `MarketResolved`
   - `WinningsClaimed`

4. **Errors**: Custom error codes

### Common Changes

#### Adding a New Instruction
1. Define the instruction method in the `#[program]` module
2. Create the accounts structure with `#[derive(Accounts)]`
3. Add error codes if needed
4. Emit events for tracking
5. Update the IDL

Example:
```rust
#[program]
pub mod foundersnet {
    pub fn new_instruction(ctx: Context<NewInstruction>, param: u64) -> Result<()> {
        // Implementation
        Ok(())
    }
}

#[derive(Accounts)]
pub struct NewInstruction<'info> {
    pub account: Account<'info, Market>,
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}
```

#### Modifying an Account Structure
1. Update the struct in `programs/foundersnet/src/lib.rs`
2. Update the frontend type in `client/src/types/`
3. Update the IDL in `client/src/idl/foundersnet.ts`
4. Rebuild: `anchor build`

#### Adding New Error Codes
```rust
#[error_code]
pub enum FoundersNetError {
    #[msg("Custom error message")]
    CustomError,
}
```

### Rebuilding After Changes

```bash
# Rebuild program
anchor build

# Copy new IDL to frontend
cp target/idl/foundersnet.json client/src/idl/foundersnet.ts

# Optionally: Update program ID if changed
# Edit VITE_PROGRAM_ID in client/.env
```

## Making Changes to the Frontend

### Adding a New Hook

The frontend uses React Query (TanStack Query) for data fetching. Create hooks in `client/src/hooks/`:

```typescript
import { useQuery } from '@tanstack/react-query'
import { useProgram } from './useProgram'

export function useNewData() {
  const program = useProgram()

  return useQuery({
    queryKey: ['newData'],
    queryFn: async () => {
      if (!program) return null
      // Fetch from program
      return data
    },
    enabled: !!program,
    staleTime: 30_000,
    refetchInterval: 30_000,
  })
}
```

### Adding a New Component

Create components in `client/src/components/`:

```typescript
import { Button } from '@/components/ui/button'

interface MyComponentProps {
  title: string
}

export function MyComponent({ title }: MyComponentProps) {
  return <div>{title}</div>
}
```

### Adding a New Page

Create pages in `client/src/pages/`:

```typescript
import { useLoaderData } from 'react-router-dom'

export function MyPage() {
  return <div>My Page</div>
}
```

### Styling Guidelines

- Use Tailwind CSS classes
- Support dark mode with `dark:` variants
- Use Shadcn UI components
- Use Lucide React icons

### Type Safety

- Use TypeScript strict mode
- Avoid `any` types (use `as any` with justification)
- Import types from `@/types/`

## Testing Workflow

### Manual Testing in Browser

1. Open DevTools (F12)
2. Connect wallet (Phantom, Solflare, etc.)
3. Test user flows:
   - View markets
   - Place bets
   - Claim winnings
   - (Admin) Create events
   - (Admin) Resolve events

### Automated Testing

```bash
# Run frontend tests
cd client
npm run test  # (if configured)

# Run program tests
anchor test
```

### Testing on Devnet

1. Deploy program to Devnet
2. Start frontend with correct PROGRAM_ID
3. Use Devnet faucet for airdrop
4. Test all features

## Debugging

### Frontend Debugging

```typescript
// Browser console
console.log('Debug message:', variable)

// React DevTools browser extension
// Inspect component state and props

// Network tab in DevTools
// Check transaction signatures and RPC calls
```

### Program Debugging

```bash
# Run with logging
RUST_LOG=debug anchor test

# Print debug info in program
msg!("Debug: {:?}", variable);
```

### Transaction Debugging

Use Solscan to inspect transactions:
```
https://solscan.io/tx/<SIGNATURE>?cluster=devnet
```

## Performance Optimization

### Frontend
- Use `useMemo` for expensive computations
- Use `useCallback` for stable function references
- Lazy load components with React.lazy()
- Enable code splitting in Vite

### Program
- Minimize account writes
- Use PDAs for deterministic lookups
- Batch operations when possible
- Keep accounts small

## Security Checklist

- [ ] All inputs validated
- [ ] No infinite loops
- [ ] Arithmetic overflow checked
- [ ] Access control enforced
- [ ] No uninitialized accounts
- [ ] Accounts properly closed
- [ ] No hardcoded secrets
- [ ] Private keys not committed
- [ ] Error messages don't leak info

## Common Issues and Solutions

### Build Fails: "expected `bool`, found `u8`"
- Ensure all type annotations match
- Check Anchor version compatibility

### Tests Fail: "Program account does not exist"
- Ensure program is deployed
- Check program ID matches

### Frontend: "Wallet not connected"
- Ensure wallet is properly initialized
- Check wallet adapter configuration

### Frontend: "Market account does not exist"
- Verify market ID is correct
- Check market was actually created
- Ensure using correct RPC endpoint

## Performance Profiling

### Frontend
```bash
# Analyze bundle size
npm run build
npm run analyze  # (if configured)
```

### Program
```bash
# Check program size
ls -lh target/deploy/foundersnet.so

# Should be < 200KB
```

## Documentation

When making changes:
1. Update this file if workflows change
2. Update `programs/foundersnet/README.md` for program changes
3. Add JSDoc comments to new functions
4. Update frontend types if data structures change

## CI/CD Integration

The project can be integrated with GitHub Actions for:
- Automatic building on push
- Running tests
- Generating IDL
- Automated deployment

See `.github/workflows/` for examples.

## Useful Commands Reference

```bash
# Program development
anchor build                          # Build program
anchor test                          # Run tests
anchor deploy --provider.cluster devnet  # Deploy to devnet

# Solana utilities
solana address                       # Show current wallet
solana balance                       # Show SOL balance
solana airdrop 2                     # Request 2 SOL airdrop
solana config get                    # Show config

# Frontend development
npm run dev                          # Start dev server
npm run build                        # Build for production
npm run lint                         # Run linter
npm run type-check                   # Check types

# Git operations
git status                           # Show changes
git add .                            # Stage changes
git commit -m "message"              # Commit changes
git push origin branch-name          # Push to remote
```

## Resources

- **Anchor Book**: https://www.anchor-lang.com/docs/intro
- **Solana Docs**: https://docs.solana.com/
- **Anchor FAQ**: https://www.anchor-lang.com/docs/faq
- **React Query**: https://tanstack.com/query/latest
- **Tailwind CSS**: https://tailwindcss.com/docs
- **TypeScript**: https://www.typescriptlang.org/docs/

## Getting Help

1. Check existing documentation
2. Search GitHub issues
3. Ask in Solana Discord
4. Check Anchor Discord
