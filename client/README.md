# FoundersNet - Minimal Devnet dApp

A decentralized prediction market platform built on Solana Devnet. This is a pure dApp with no backend - all state and logic reside on the Solana blockchain.

## 🚀 Installation & Setup

### Prerequisites

Before getting started, ensure you have:

- **Node.js 20+** (LTS recommended)
- **pnpm** or **npm** package manager
- **Solana wallet extension** installed in your browser:
  - [Phantom Wallet](https://phantom.app/) (recommended)
  - [Solflare](https://solflare.com/)
  - [Trust Wallet](https://trustwallet.com/)

### Installation

1. **Navigate to the client directory:**
   ```bash
   cd client
   ```

2. **Install dependencies:**
   ```bash
   pnpm install
   # or
   npm install
   ```

3. **Configure environment variables:**
   ```bash
   cp .env.example .env
   ```

4. **Review and update `.env` file:**
   ```env
   VITE_SOLANA_NETWORK=devnet
   VITE_SOLANA_RPC_ENDPOINT=https://api.devnet.solana.com
   VITE_PROGRAM_ID=placeholder_will_be_updated_after_deployment
   ```

   > **Note:** The `VITE_PROGRAM_ID` will be updated once the Anchor program is deployed to Solana Devnet.

## 🏃 Running Development Server

Start the development server:

```bash
cd client
pnpm dev
```

The application will be available at:
- **Local:** `http://localhost:5173`
- **Network:** `http://[your-ip]:5173` (accessible from other devices)

The server supports hot module replacement (HMR) - changes to your code will instantly reflect in the browser.

## 🧪 Manual Testing Checklist

Use this comprehensive checklist to verify all features are working correctly:

### ✅ 1. Wallet Connection

- [ ] **Connect Wallet**
  - Click "Connect Wallet" button in header
  - Wallet modal appears with available wallet options
  - Select a wallet (Phantom, Solflare, or Trust)
  - Browser extension prompts for approval
  - Upon approval, modal closes and header updates

- [ ] **Connected State**
  - Wallet address displayed in header (truncated: `5Gx7...k3Pm`)
  - SOL balance displayed: `◎ X.XX`
  - Clicking wallet address opens dropdown menu

- [ ] **Wallet Dropdown**
  - Full wallet address shown (copyable)
  - Current SOL balance displayed
  - "Airdrop 1 SOL" button visible (Devnet only)
  - "View on Solscan" link opens correct Devnet page
  - "Disconnect" button present

- [ ] **Airdrop Functionality**
  - Click "Airdrop 1 SOL"
  - Pending toast notification appears
  - After 2-3 seconds, success or error toast appears
  - If successful, balance updates automatically
  - If rate limited, appropriate error message shown

- [ ] **Disconnect Wallet**
  - Click "Disconnect" in dropdown
  - Wallet state clears
  - Header reverts to "Connect Wallet" button
  - Redirected to home if on protected route

### ✅ 2. Navigation

- [ ] **Header Navigation**
  - "Markets" tab navigates to home (/)
  - "Portfolio" tab navigates to /portfolio
  - "Create" tab navigates to /create
  - Active tab has blue underline and proper styling
  - Navigation works without page reload (client-side routing)

- [ ] **Devnet Badge**
  - Yellow "⚠️ DEVNET MODE" badge visible at all times
  - Badge is non-dismissible
  - Visible on all pages

- [ ] **Theme Toggle**
  - Sun/Moon icon button visible in header
  - Clicking toggles between light and dark mode
  - Theme preference persists across page refreshes
  - All components adapt to theme changes

- [ ] **Protected Routes**
  - Accessing /portfolio without wallet shows toast and redirects to /
  - Accessing /create without wallet shows toast and redirects to /
  - After connecting wallet, can access both routes

### ✅ 3. Market Listing (Dashboard)

- [ ] **Page Load**
  - Navigate to "/" or click "Markets" tab
  - Page title shows "Active Markets"
  - Loading skeleton cards appear while fetching data
  - 4 mock markets load after skeleton state

- [ ] **Market Cards**
  - Each card shows:
    - Market title (truncated if long)
    - Category badge with appropriate color
    - Status indicator (Open/Resolved)
    - Resolution date or time remaining
    - YES pool with percentage (green)
    - NO pool with percentage (red)
    - Total pool amount
  - Hover effect: card elevates with shadow
  - Clicking card navigates to market detail

- [ ] **Filter - Status**
  - Dropdown shows: All, Open, Resolved
  - Select "Open" - only open markets shown
  - Select "Resolved" - only resolved markets shown
  - Select "All" - all markets shown

- [ ] **Filter - Category**
  - Dropdown shows: All, Sports, Politics, Crypto, Entertainment, Other
  - Select "Sports" - only sports markets shown
  - Select "Crypto" - only crypto markets shown
  - Other categories filter correctly

- [ ] **Sort Options**
  - "Volume ↓" - markets sorted by highest volume first
  - "Resolution Date ↑" - markets sorted by soonest resolving first
  - "Recently Created" - newest markets appear first

- [ ] **Responsive Design**
  - Desktop (1024px+): 3-column grid layout
  - Tablet (768px): 2-column grid layout
  - Mobile (<640px): Single column, filters stack vertically

- [ ] **Empty State**
  - If no markets match filters, "No markets found" message appears
  - "Create Market" button shown (if wallet connected)

### ✅ 4. Market Detail View

- [ ] **Page Load**
  - Click on any market card
  - Navigate to `/market/:marketId`
  - Loading skeleton appears briefly
  - Market detail page loads with correct data

- [ ] **Market Header**
  - Market title displayed prominently
  - Category badge with correct color
  - Status indicator (Open/Resolved)
  - Resolution date with countdown

- [ ] **Market Description**
  - Full description text displayed
  - Resolution criteria clearly stated
  - Markdown formatting supported (if applicable)

- [ ] **Market Stats Card**
  - Total Volume displayed correctly
  - YES Pool amount and percentage shown
  - NO Pool amount and percentage shown
  - Participants count (if available)
  - Creation date displayed

- [ ] **Pool Chart**
  - Chart displays YES and NO pool ratio
  - Visual representation is clear
  - Colors match (green for YES, red for NO)
  - Percentages add up to 100%

- [ ] **Two-Column Layout**
  - Desktop: Left column (info) + Right column (trading widget)
  - Mobile: Stacked layout (info above trading widget)

### ✅ 5. Trading Widget

- [ ] **Widget Display**
  - Trading widget visible on market detail page
  - Shows "Place Trade" header
  - Two tabs: YES and NO

- [ ] **Outcome Selection**
  - Click YES tab - turns green, shows YES pool info
  - Click NO tab - turns red, shows NO pool info
  - Selected outcome stays active

- [ ] **Amount Input**
  - Number input field accepts decimal values
  - Minimum: 0.01 SOL
  - Maximum: Wallet balance - 0.01 SOL
  - "Max" button fills with maximum allowed amount

- [ ] **Validation**
  - Enter amount < 0.01 SOL - error message appears
  - Enter amount > wallet balance - error message appears
  - Enter valid amount - no error message

- [ ] **Trade Summary**
  - Shows betting amount and outcome
  - Displays current pool ratio
  - Shows "After This Bet" pool ratio
  - Calculates potential payout correctly
  - Displays estimated fee (◎0.00025)

- [ ] **Current Position (if exists)**
  - If user has existing position, shows:
    - Number of shares held
    - Cost basis
    - Styled in blue alert box

- [ ] **Place Trade Button**
  - Without wallet: Shows "Connect Wallet"
  - With wallet, no amount: Shows "Enter Amount"
  - With invalid amount: Shows "Invalid Amount" (disabled)
  - With valid amount: Shows "Place Bet on YES/NO" (enabled)
  - For resolved markets: Shows "Market Resolved" (disabled)

- [ ] **Trade Execution (Mock)**
  - Click "Place Bet"
  - Pending toast appears with transaction signature
  - 2-second simulated delay
  - Success toast appears (70% chance) with Solscan link
  - Or error toast appears (30% chance) with error message
  - On success, amount field clears

### ✅ 6. Portfolio View

- [ ] **Access Control**
  - Without wallet: Redirects to home with toast notification
  - With wallet: Portfolio page loads

- [ ] **Positions List**
  - Page title: "Your Positions"
  - Shows all user positions (empty for now with mock data)
  - Empty state: "You haven't placed any bets yet"
  - "Explore Markets" button navigates to home

- [ ] **Transaction History**
  - Section title: "Transaction History"
  - Shows list of user's trades (empty with mock data)
  - Empty state: "Your bets will appear here"

- [ ] **Portfolio Summary (if data exists)**
  - Total portfolio value
  - Total P&L (profit/loss)
  - Win rate percentage

### ✅ 7. Create Market View

- [ ] **Access Control**
  - Without wallet: Redirects to home with toast notification
  - With wallet: Create market page loads

- [ ] **Page Display**
  - Page title: "Create New Market"
  - Placeholder: "Market creation form will appear here"
  - (Form not yet implemented in this phase)

### ✅ 8. Notification System

- [ ] **Toast Notifications**
  - Appear in bottom-right corner
  - Auto-dismiss after appropriate time
  - Can be manually dismissed with X button

- [ ] **Pending Notifications**
  - Show spinning loader icon
  - Display "Transaction Submitted" title
  - Include Solscan link
  - Do NOT auto-dismiss

- [ ] **Success Notifications**
  - Show green check icon
  - Display success message
  - Include Solscan link
  - Auto-dismiss after 5 seconds

- [ ] **Error Notifications**
  - Show red X icon
  - Display error message
  - Auto-dismiss after 10 seconds
  - User-friendly error messages (not technical codes)

### ✅ 9. Responsive Design

Test at different viewport sizes:

- [ ] **Mobile (375px)**
  - Single column layouts
  - Filters stack vertically
  - Trading widget full-width
  - Navigation collapses (if applicable)
  - Touch targets ≥ 44px
  - Text is readable

- [ ] **Tablet (768px)**
  - 2-column market grid
  - Filters in row
  - Trading widget proper sizing
  - All content accessible

- [ ] **Desktop (1440px)**
  - 3-column market grid
  - Two-column market detail layout
  - Full filter bar visible
  - Maximum content width applied (max-w-7xl)

### ✅ 10. Dark Mode

- [ ] **Theme Toggle**
  - Click theme toggle button in header
  - All components switch to dark mode:
    - Background: Dark slate
    - Cards: Slightly lighter dark
    - Text: Light colors
    - Borders: Subtle
  - Toggle back to light mode - all components revert
  - Theme preference persists on page reload

- [ ] **Component Styling**
  - All Shadcn UI components support dark mode
  - Custom components use dark: variants
  - No contrast issues in either mode
  - Icons visible in both modes

### ✅ 11. Loading & Empty States

- [ ] **Loading States**
  - Market listing shows skeleton cards
  - Market detail shows skeleton layout
  - Smooth transition from skeleton to content

- [ ] **Empty States**
  - No markets: Helpful message with CTA
  - No positions: Guidance to explore markets
  - No transactions: Informative message

- [ ] **Error Boundaries**
  - Component errors show fallback UI
  - Error details in development mode
  - "Reload Page" button available

### ✅ 12. Browser Console

- [ ] **No Errors**
  - Open browser DevTools (F12)
  - Check Console tab
  - No red error messages
  - No warnings about missing dependencies
  - No TypeScript errors

- [ ] **Network Tab**
  - RPC calls to Solana Devnet successful
  - No 404 or 500 errors
  - Reasonable response times (<3 seconds)

## 🛠️ Common Issues & Solutions

### Issue: Port 5173 Already in Use

**Error:** `Port 5173 is already in use`

**Solution:**
```bash
# Find the process using port 5173
lsof -ti:5173

# Kill the process (macOS/Linux)
kill -9 $(lsof -ti:5173)

# Or use npx kill-port (all platforms)
npx kill-port 5173

# Then restart the dev server
pnpm dev
```

### Issue: Module Not Found Errors

**Error:** `Cannot find module '@/components/...'`

**Solution:**
```bash
# Clean install all dependencies
rm -rf node_modules package-lock.json
pnpm install

# Verify tsconfig.json has correct path mappings
# Should include: "paths": { "@/*": ["./src/*"] }
```

### Issue: TypeScript Compilation Errors

**Error:** `Type 'X' is not assignable to type 'Y'`

**Solution:**
```bash
# Run type check to see all errors
pnpm type-check

# Common fixes:
# 1. Ensure all imports are correct
# 2. Check that types match expected values
# 3. Verify environment variables are defined
# 4. Clear TypeScript cache
rm -rf node_modules/.vite
```

### Issue: Wallet Connection Fails

**Error:** `Failed to connect wallet` or `User rejected request`

**Solution:**
1. Ensure wallet extension is installed and unlocked
2. Check that wallet is set to Devnet network
3. Try refreshing the page and reconnecting
4. Try a different wallet adapter
5. Check browser console for specific error messages

### Issue: Airdrop Fails (Rate Limited)

**Error:** `Airdrop failed: Rate limit exceeded`

**Solution:**
1. Wait 5-10 minutes before requesting another airdrop
2. Use the [Solana Devnet Faucet](https://faucet.solana.com/) as alternative
3. Request SOL from other Devnet faucets:
   - QuickNode Faucet
   - SolFaucet

### Issue: Styles Not Updating

**Error:** CSS changes not reflected in browser

**Solution:**
```bash
# Clear Vite cache
rm -rf node_modules/.vite

# Restart dev server
pnpm dev

# If still not working, hard refresh browser
# Chrome/Firefox: Ctrl+Shift+R (Cmd+Shift+R on Mac)
```

### Issue: Hot Module Replacement (HMR) Not Working

**Error:** Changes require manual page refresh

**Solution:**
```bash
# Ensure dev server started with --host flag
pnpm dev

# Check vite.config.ts has correct HMR settings
# Restart dev server if changes were made
```

### Issue: Dark Mode Not Persisting

**Error:** Theme resets to light mode on page reload

**Solution:**
1. Check browser localStorage is enabled
2. Verify `main.tsx` has theme initialization code
3. Clear browser cache and localStorage
4. Check console for localStorage errors

## 📋 Available Scripts

- **`pnpm dev`** - Start development server with HMR at localhost:5173
- **`pnpm build`** - Type-check and build for production
- **`pnpm preview`** - Preview production build locally
- **`pnpm type-check`** - Run TypeScript compiler without emitting files
- **`pnpm lint`** - Lint all TypeScript files for code quality issues

## 🏗️ Tech Stack

- **Frontend:** React 18, TypeScript (strict mode)
- **Styling:** Tailwind CSS, Shadcn UI, Radix UI primitives
- **Blockchain:** Solana Devnet, @solana/web3.js, @coral-xyz/anchor
- **Wallet:** @solana/wallet-adapter-react (Phantom, Solflare, Trust)
- **Data Fetching:** TanStack Query v5
- **Routing:** React Router v6
- **Forms:** Zod validation, react-hook-form
- **Charts:** Recharts
- **Build Tool:** Vite

## 🎯 Current Development Status

This project currently uses **mock data** for all blockchain interactions. The following features are fully functional with mock data:

✅ **Implemented:**
- Wallet connection and management
- Devnet airdrop functionality
- Market listing with filtering and sorting
- Market detail view with statistics
- Trading widget with calculations
- Responsive design (mobile, tablet, desktop)
- Dark mode support
- Transaction notifications
- Error handling with user-friendly messages
- Loading states and empty states
- Protected routes (wallet required)

⏳ **Pending (requires deployed Anchor program):**
- Actual on-chain market creation
- Real trading transactions
- Live position tracking
- Market resolution
- Claiming winnings
- Transaction history
- Real-time market updates via WebSocket

## 🔗 Useful Links

- [Solana Devnet Explorer (Solscan)](https://solscan.io/?cluster=devnet)
- [Solana Devnet Faucet](https://faucet.solana.com/)
- [Phantom Wallet](https://phantom.app/)
- [Solflare Wallet](https://solflare.com/)
- [Solana Web3.js Docs](https://solana-labs.github.io/solana-web3.js/)
- [Anchor Framework Docs](https://www.anchor-lang.com/)

## 📝 Notes

- All Solscan links point to **Devnet** cluster
- Airdrop functionality is **Devnet-only** (not available on mainnet)
- Transaction fees on Devnet are paid with Devnet SOL (no real value)
- This is a **development/testing** environment - never use mainnet private keys

## 🤝 Contributing

This is a minimal MVP. For issues or enhancements, please refer to the project's GitHub repository.

---

Built with ❤️ on Solana Devnet
