# FoundersNet dApp - AI Agent Build Prompts Sequence

This document provides the first 10 prompts to guide an AI coding agent through building the FoundersNet dApp, ordered for optimal dependency management and incremental functionality.

---

## Prompt 1: Project Initialization & Configuration

```
Initialize the FoundersNet dApp project with the following structure:

1. Create a Vite + React + TypeScript project in `/client` directory
2. Install and configure all dependencies from tech-stack.md:
   - Core: React 18+, TypeScript, Vite
   - Styling: Tailwind CSS, Shadcn UI (with CLI setup)
   - Solana: @solana/web3.js, @coral-xyz/anchor, @solana/wallet-adapter-react, @solana/wallet-adapter-react-ui, @solana/wallet-adapter-wallets
   - State: TanStack Query v5
   - Routing: React Router v6
   - UI: Lucide React, Recharts, date-fns, Zod

3. Set up configuration files:
   - tailwind.config.js (with Shadcn UI configuration)
   - tsconfig.json (strict mode enabled)
   - vite.config.ts (with path aliases: @/components, @/lib, @/hooks)
   - .env.example with:
     ```
     VITE_SOLANA_NETWORK=devnet
     VITE_SOLANA_RPC_ENDPOINT=https://api.devnet.solana.com
     VITE_PROGRAM_ID=placeholder_program_id
     ```

4. Create the directory structure from tech-stack.md:
   ```
   client/src/
   ├── components/
   │   ├── ui/           (Shadcn components)
   │   ├── wallet/
   │   ├── market/
   │   └── layout/
   ├── hooks/
   ├── lib/
   ├── types/
   ├── pages/
   ├── App.tsx
   └── main.tsx
   ```

5. Initialize Shadcn UI and install these components:
   - button, card, input, label, select, dialog, dropdown-menu, toast, tabs, badge, separator

Do NOT implement any functionality yet - only setup and configuration.
```

---

## Prompt 2: Type Definitions & Constants

```
Create the TypeScript type definitions and constants for the FoundersNet dApp.

Reference: requirements.md Section 4 (Business Logic) and tech-stack.md Section 7 (Integration Strategy)

1. Create `/client/src/types/market.ts`:
   - Define `MarketStatus` enum: Open, Resolved
   - Define `MarketOutcome` enum: Yes, No, Invalid
   - Define `MarketCategory` enum: Sports, Politics, Crypto, Entertainment, Other
   - Define `Market` interface with fields:
     * publicKey: PublicKey
     * title: string (10-200 chars)
     * description: string (50-1000 chars)
     * category: MarketCategory
     * resolutionDate: number (Unix timestamp)
     * creator: PublicKey
     * resolver: PublicKey
     * yesPool: number (in lamports, convert to SOL for display)
     * noPool: number (in lamports)
     * totalVolume: number (in lamports)
     * status: MarketStatus
     * outcome?: MarketOutcome
     * createdAt: number

2. Create `/client/src/types/position.ts`:
   - Define `UserPosition` interface:
     * publicKey: PublicKey
     * market: PublicKey
     * user: PublicKey
     * yesShares: number (in lamports)
     * noShares: number (in lamports)
     * totalCost: number (in lamports)
     * lastTradeAt: number

3. Create `/client/src/types/trade.ts`:
   - Define `TradeOutcome` enum: Yes, No
   - Define `Trade` interface for transaction history

4. Create `/client/src/lib/constants.ts`:
   - MIN_TRADE_AMOUNT = 0.01 (SOL)
   - MIN_LIQUIDITY_AMOUNT = 0.5 (SOL)
   - TRANSACTION_FEE_BUFFER = 0.01 (SOL)
   - MIN_TITLE_LENGTH = 10
   - MAX_TITLE_LENGTH = 200
   - MIN_DESCRIPTION_LENGTH = 50
   - MAX_DESCRIPTION_LENGTH = 1000
   - SOLSCAN_BASE_URL = "https://solscan.io"
   - DEVNET_RPC = "https://api.devnet.solana.com"

5. Create `/client/src/lib/utils.ts`:
   - `lamportsToSol(lamports: number): number` - converts lamports to SOL
   - `solToLamports(sol: number): number` - converts SOL to lamports
   - `formatSol(amount: number): string` - formats as "◎1.23"
   - `truncateAddress(address: string): string` - formats as "5Gx7...k3Pm"
   - `calculateImpliedOdds(poolSize: number, totalPool: number): number` - returns percentage
   - `calculatePotentialPayout(shares: number, totalWinningShares: number, totalPool: number): number`
   - `formatDate(timestamp: number): string` - human-readable date
   - `cn(...classes)` - Tailwind class merger (for Shadcn)

All functions must have JSDoc comments and proper TypeScript typing.
```

---

## Prompt 3: Solana Connection & Wallet Provider Setup

```
Set up Solana blockchain connection and wallet adapter integration.

Reference: tech-stack.md Section 3 (Solana Integration Libraries) and design-notes.md Section 5 (Solana Integration Patterns)

1. Create `/client/src/lib/solana.ts`:
   - Export `connection` instance using Connection from @solana/web3.js
   - Use RPC endpoint from environment variable (VITE_SOLANA_RPC_ENDPOINT)
   - Set commitment level to "confirmed"
   - Export `NETWORK` constant (devnet)

2. Create `/client/src/App.tsx` with provider setup:
   - Import WalletAdapterNetwork from @solana/wallet-adapter-base
   - Import ConnectionProvider, WalletProvider from @solana/wallet-adapter-react
   - Import WalletModalProvider from @solana/wallet-adapter-react-ui
   - Import wallet adapters: PhantomWalletAdapter, SolflareWalletAdapter, BackpackWalletAdapter
   - Import CSS: '@solana/wallet-adapter-react-ui/styles.css'
   - Wrap entire app with:
     * ConnectionProvider (endpoint from env)
     * WalletProvider (with wallets array: Phantom, Solflare, Backpack)
     * WalletModalProvider
   - Include QueryClientProvider from TanStack Query with default options:
     ```typescript
     const queryClient = new QueryClient({
       defaultOptions: {
         queries: {
           staleTime: 30_000, // 30 seconds
           refetchOnWindowFocus: true,
         },
       },
     });
     ```

3. Create `/client/src/hooks/useWallet.ts`:
   - Custom hook that wraps @solana/wallet-adapter-react's useWallet
   - Export: { publicKey, connected, connecting, disconnect, connect, wallet }
   - Add helper: `getBalance()` async function using connection.getBalance()

4. Create `/client/src/main.tsx`:
   - Import and render <App />
   - Wrap with React.StrictMode
   - Include Toaster component from Shadcn UI for notifications

Do NOT create any UI components yet - only provider setup and connection logic.
```

---

## Prompt 4: Layout Components & Navigation

```
Create the global layout components (Header, Navigation, Footer) with wallet integration.

Reference: design-notes.md Section 2 (Global Layout) and Section 5 (Solana Integration Patterns)

1. Create `/client/src/components/layout/Header.tsx`:
   - Fixed top navigation bar with backdrop blur effect
   - Three sections (left, center, right) using flexbox
   
   LEFT SECTION:
   - Logo/App name: "FoundersNet" with Solana icon (from lucide-react)
   - Font: text-xl font-bold
   
   CENTER SECTION (desktop only, hidden on mobile):
   - Navigation tabs: "Markets", "Portfolio", "Create"
   - Use React Router's NavLink with active state styling (blue underline)
   - Mobile: Will be hamburger menu (implement in next phase)
   
   RIGHT SECTION:
   - DevnetBadge component (create separately)
   - ThemeToggle component (create separately)
   - WalletButton component (create separately)

2. Create `/client/src/components/layout/DevnetBadge.tsx`:
   - Yellow/amber badge (bg-yellow-100 dark:bg-yellow-900)
   - Text: "⚠️ DEVNET MODE"
   - Always visible, non-dismissible
   - Tooltip: "This app uses Solana Devnet. No real funds at risk."
   - Use Shadcn Badge component

3. Create `/client/src/components/wallet/WalletButton.tsx`:
   - Uses useWallet hook
   - DISCONNECTED state:
     * Purple button (bg-purple-600)
     * Text: "Connect Wallet"
     * Icon: Wallet icon from lucide-react
     * onClick: triggers wallet modal (from WalletModalProvider)
   - CONNECTED state:
     * Shows truncated address (using truncateAddress util)
     * Shows SOL balance (fetch with useBalance hook)
     * Format: "5Gx7...k3Pm | ◎2.45"
     * Click opens DropdownMenu with:
       - Full address (copyable with Copy icon)
       - SOL balance display
       - Divider
       - "Airdrop 1 SOL" button (will implement functionality later)
       - "View on Solscan" link (opens devnet.solscan.io in new tab)
       - Divider
       - "Disconnect" button (red text)

4. Create `/client/src/hooks/useBalance.ts`:
   - Uses TanStack Query to fetch wallet balance
   - Queries connection.getBalance(publicKey)
   - Refetches every 30 seconds
   - Returns balance in SOL (converted from lamports)

5. Create `/client/src/components/layout/Footer.tsx`:
   - Simple footer with links: "Built on Solana Devnet | Docs | GitHub | Twitter"
   - Text: text-sm text-gray-500
   - Sticky at bottom

6. Create `/client/src/components/layout/Layout.tsx`:
   - Renders Header, main content area (Outlet from React Router), and Footer
   - Main area: max-w-7xl mx-auto px-4 sm:px-6 lg:px-8

Use Shadcn UI components (Button, Badge, DropdownMenu, Separator) and Tailwind CSS only.
Implement dark mode support using dark: variants.
```

---

## Prompt 5: Router Setup & Basic Page Shells

```
Set up React Router and create empty page component shells.

Reference: design-notes.md Section 3 (Key UI/UX Components) and requirements.md REQ-VIEW

1. Update `/client/src/App.tsx`:
   - Import BrowserRouter, Routes, Route from react-router-dom
   - Wrap the app with BrowserRouter
   - Define routes:
     * "/" - Markets (dashboard)
     * "/market/:marketId" - Market Detail
     * "/portfolio" - Portfolio (protected route - requires wallet)
     * "/create" - Create Market (protected route - requires wallet)
   - All routes use Layout component wrapper

2. Create `/client/src/pages/Markets.tsx`:
   - Page title: "Active Markets" (text-2xl font-bold)
   - Placeholder: "Market listings will appear here"
   - Empty div with min-height for now

3. Create `/client/src/pages/MarketDetail.tsx`:
   - Uses useParams to get marketId from URL
   - Page title: "Market Detail"
   - Placeholder: "Market details for {marketId} will appear here"

4. Create `/client/src/pages/Portfolio.tsx`:
   - Check if wallet is connected using useWallet
   - If NOT connected: Show message "Connect your wallet to view portfolio" and redirect to "/"
   - If connected: Show placeholder "Your positions will appear here"

5. Create `/client/src/pages/Create.tsx`:
   - Check if wallet is connected
   - If NOT connected: Show message "Connect your wallet to create markets" and redirect to "/"
   - If connected: Show placeholder "Market creation form will appear here"

6. Create `/client/src/components/ProtectedRoute.tsx`:
   - Wrapper component that checks wallet connection
   - If not connected: Shows toast message and redirects to "/"
   - If connected: Renders children
   - Use this for /portfolio and /create routes

7. Update Navigation in Header:
   - Make nav links functional using React Router NavLink
   - Add active state styling (underline, purple accent)

All pages should use consistent padding and max-width from Layout component.
No actual data fetching yet - just routing structure and navigation.
```

---

## Prompt 6: Anchor Program Integration Setup

```
Set up Anchor program integration and create hooks for fetching blockchain data.

Reference: tech-stack.md Section 3 (Solana Integration Libraries) and design-notes.md Section 9 (Data Structures)

IMPORTANT: For this prompt, we'll create the integration layer assuming the Anchor program is deployed. The actual Program ID will be added later via environment variable.

1. Create `/client/src/lib/anchor.ts`:
   - Import Program, AnchorProvider, setProvider from @coral-xyz/anchor
   - Import connection from lib/solana.ts
   - Create function `getProgram(wallet)`:
     * Creates AnchorProvider using connection and wallet
     * Returns Program instance using IDL and program ID from env
   - For now, create a placeholder IDL structure (will be replaced with actual IDL):
     ```typescript
     const IDL_PLACEHOLDER = {
       version: "0.1.0",
       name: "foundersnet",
       instructions: [
         { name: "createMarket", accounts: [], args: [] },
         { name: "placeBet", accounts: [], args: [] },
         { name: "resolveMarket", accounts: [], args: [] },
       ],
       accounts: [
         {
           name: "market",
           type: {
             kind: "struct",
             fields: [
               { name: "title", type: "string" },
               { name: "yesPool", type: "u64" },
               { name: "noPool", type: "u64" },
               // ... other fields matching Market type
             ],
           },
         },
       ],
     };
     ```

2. Create `/client/src/hooks/useProgram.ts`:
   - Custom hook that returns the Anchor program instance
   - Uses useWallet to get wallet
   - Memoizes program instance
   - Returns null if wallet not connected

3. Create `/client/src/hooks/useMarkets.ts`:
   - Uses TanStack Query to fetch all markets
   - Query key: ['markets', 'all']
   - For now, return MOCK DATA (array of 3-5 sample markets):
     ```typescript
     const MOCK_MARKETS: Market[] = [
       {
         publicKey: new PublicKey("..."),
         title: "Will Bitcoin reach $100k by Dec 31, 2025?",
         description: "Market resolves YES if BTC price reaches $100,000...",
         category: MarketCategory.Crypto,
         resolutionDate: Date.now() / 1000 + 86400 * 30, // 30 days from now
         creator: new PublicKey("..."),
         resolver: new PublicKey("..."),
         yesPool: solToLamports(60),
         noPool: solToLamports(40),
         totalVolume: solToLamports(100),
         status: MarketStatus.Open,
         createdAt: Date.now() / 1000,
       },
       // ... 2-4 more markets
     ];
     ```
   - Comment: "TODO: Replace with actual program.account.market.all()"
   - Stale time: 30 seconds
   - Refetch interval: 30 seconds

4. Create `/client/src/hooks/useMarket.ts`:
   - Similar to useMarkets but for single market by ID
   - Takes marketId parameter
   - Query key: ['market', marketId]
   - Returns MOCK DATA for now (find by ID from MOCK_MARKETS)
   - Comment: "TODO: Replace with program.account.market.fetch(marketId)"

5. Create `/client/src/hooks/useUserPositions.ts`:
   - Fetches user's positions across all markets
   - Requires connected wallet
   - Query key: ['positions', publicKey.toString()]
   - Returns MOCK DATA for now (empty array or 1-2 sample positions)
   - Comment: "TODO: Fetch from PDAs derived from wallet + market accounts"

The goal is to set up the data layer structure with mock data so we can build UI components in the next prompts. The actual blockchain queries will be implemented once the Anchor program is deployed.
```

---

## Prompt 7: Market Listing View (Dashboard)

```
Create the Market Listing view (Dashboard) with filtering and sorting.

Reference: design-notes.md Section 3.A (Market Listing View) and requirements.md REQ-VIEW-001, REQ-MARKET-003 to REQ-MARKET-005

1. Update `/client/src/pages/Markets.tsx`:
   
   STRUCTURE:
   - Page title: "Active Markets" (text-2xl font-bold mb-6)
   - Filter/Sort bar (top-right):
     * Status filter: Dropdown using Shadcn Select (All, Open, Resolved)
     * Category filter: Dropdown (All, Sports, Politics, Crypto, Entertainment, Other)
     * Sort: Dropdown (Volume ↓, Resolution Date ↑, Recently Created)
   - Market list area

2. Create `/client/src/components/market/MarketCard.tsx`:
   - Card component showing single market
   - Props: market: Market
   
   CARD CONTENT:
   - Title (text-lg font-semibold, truncate if too long)
   - Category badge (small colored pill using Shadcn Badge)
   - Resolution date: "Resolves Dec 31, 2025" or "Resolves in 5 days" (use date-fns)
   - Pool information:
     * "YES Pool: ◎60 (60%)" in green
     * "NO Pool: ◎40 (40%)" in red
   - Total Volume: "◎100 Total Pool"
   - Status indicator: "Open" (green) or "Resolved" (gray)
   
   INTERACTION:
   - Entire card is clickable
   - Hover effect: elevation shadow, cursor pointer
   - onClick: navigate to `/market/${market.publicKey.toString()}`

3. Create `/client/src/components/market/MarketList.tsx`:
   - Takes markets array prop
   - Desktop (lg+): Grid layout (2-3 columns)
   - Mobile: Single column
   - Each item: <MarketCard market={market} key={...} />
   - Loading state: 6 skeleton cards using Shadcn Skeleton
   - Empty state: "No markets found. Create the first one!" with button

4. Implement filtering and sorting in Markets.tsx:
   - Use useState for filter/sort values
   - Apply filters to markets array:
     * Status filter: filter by market.status
     * Category filter: filter by market.category
   - Apply sorting:
     * Volume: sort by totalVolume descending
     * Resolution Date: sort by resolutionDate ascending
     * Recently Created: sort by createdAt descending
   - Pass filtered/sorted array to MarketList

5. Use useMarkets hook:
   - const { data: markets, isLoading } = useMarkets()
   - Show loading skeletons while isLoading
   - Show empty state if markets array is empty

6. Responsive design:
   - Filter bar stacks vertically on mobile
   - Grid adapts: 1 column (mobile) → 2 columns (tablet) → 3 columns (desktop)
   - Use Tailwind breakpoints: sm:, md:, lg:

Use only Shadcn UI components and Tailwind CSS.
All monetary values must use formatSol() utility.
All dates must use formatDate() utility.
```

---

## Prompt 8: Market Detail View - Info & Stats

```
Create the Market Detail view layout with market information and statistics.

Reference: design-notes.md Section 3.B (Market Detail View) and requirements.md REQ-VIEW-002, REQ-VIEW-008

1. Update `/client/src/pages/MarketDetail.tsx`:
   
   LAYOUT:
   - Two-column layout on desktop (lg:grid lg:grid-cols-3 lg:gap-8)
   - Left column (2/3 width): Market info + trading widget
   - Right column (1/3 width): Chart + stats
   - Mobile: Single column, stacked

2. LEFT COLUMN - Create `/client/src/components/market/MarketHeader.tsx`:
   - Market title (text-3xl font-bold mb-4)
   - Category badge (colored pill)
   - Status indicator: "Open" (green badge) or "Resolved" (gray badge)
   - Resolution date: "Resolves on Dec 31, 2025, 11:59 PM UTC"
   - If past resolution date but not resolved: "Resolution pending"

3. LEFT COLUMN - Create `/client/src/components/market/MarketDescription.tsx`:
   - Section title: "Description"
   - Full description text (preserve line breaks)
   - Resolution criteria section
   - If description is long (>500 chars), add "Read more/less" toggle

4. RIGHT COLUMN - Create `/client/src/components/market/MarketStats.tsx`:
   - Card component with stats:
     * Total Pool: "◎100" (large, bold)
     * YES Pool: "◎60 (60%)" (green)
     * NO Pool: "◎40 (40%)" (red)
     * Total Volume: "◎100" (same as pool for now)
     * Participants: "12 traders" (placeholder - actual count in future)
     * Created: "5 days ago" (use date-fns formatDistanceToNow)

5. RIGHT COLUMN - Create `/client/src/components/market/PoolChart.tsx`:
   - Card component with title "Pool Distribution"
   - Placeholder for chart:
     * Simple bar chart or pie chart showing YES vs NO pool ratio
     * Use Recharts library
     * Two bars/segments: YES (green) and NO (red)
     * Values in SOL
   - For now, static chart showing current pool state
   - TODO comment: "Will add historical pool size tracking in future"

6. In MarketDetail.tsx:
   - Use useMarket(marketId) hook to fetch data
   - Show loading state while fetching (skeleton components)
   - If market not found: Show error message "Market not found" and link back to Markets
   - Layout structure:
     ```jsx
     <div className="lg:grid lg:grid-cols-3 lg:gap-8">
       <div className="lg:col-span-2">
         <MarketHeader market={market} />
         <MarketDescription description={market.description} />
         {/* Trading widget will go here next */}
       </div>
       <div className="space-y-6">
         <PoolChart market={market} />
         <MarketStats market={market} />
       </div>
     </div>
     ```

7. Responsive considerations:
   - On mobile: Stats card appears after description, before trading widget
   - Chart scrolls horizontally if needed on small screens
   - All cards have consistent padding (p-6)

Use Shadcn Card, Badge components and Tailwind CSS.
All SOL amounts formatted with formatSol() utility.
All dates formatted with date-fns functions.
```

---

## Prompt 9: Trading Widget UI (No Blockchain Integration Yet)

```
Create the Trading Widget UI with all calculations but no actual blockchain transactions yet.

Reference: design-notes.md Section 3.B (Trading Widget) and requirements.md REQ-TRADE-001 to REQ-TRADE-011

1. Create `/client/src/components/market/TradingWidget.tsx`:
   
   PROPS:
   - market: Market
   
   STATE:
   - selectedOutcome: 'yes' | 'no' (default: 'yes')
   - amount: string (user input)
   - validationError: string | null

2. WIDGET STRUCTURE (in a Card component):
   
   HEADER:
   - Title: "Place Bet" (text-xl font-semibold)
   
   OUTCOME SELECTOR:
   - Two large toggle buttons (Shadcn Tabs):
     * "YES" (green when selected, text-green-600 bg-green-50)
     * "NO" (red when selected, text-red-600 bg-red-50)
   - Show current pool for selected outcome:
     * "YES Pool: ◎60 (60%)" below YES button
     * "NO Pool: ◎40 (40%)" below NO button
   
   AMOUNT INPUT:
   - Label: "Amount (SOL)"
   - Input field (type="number", step="0.01", min="0.01")
   - Max button: "Max" (right side of input)
     * onClick: fills with wallet balance minus 0.01 SOL
   - Validation (show error below input in red):
     * Must be >= 0.01 SOL (MIN_TRADE_AMOUNT)
     * Must be <= wallet balance - 0.01 SOL
     * Must be a valid number
   - If user not connected: disable input and show "Connect wallet to trade"
   
   TRADE SUMMARY (only show if amount is valid):
   - "You're betting: ◎{amount} on {YES/NO}"
   - "Current pool ratio: {YES%} / {NO%}"
   - "After your bet: {newYES%} / {newNO%}"
   - Calculate potential payout:
     * Your shares = amount (1 SOL = 1 share)
     * If you win:
       - Total winning pool = selected pool + amount
       - Your payout = (amount / total winning pool) × (total pool + amount)
       - Show: "If {outcome} wins: ◎{payout} ({profit%} profit)"
     * If you lose: "If {outcome} loses: ◎0 (100% loss)"
   - Estimated fee: "◎0.00025"
   
   USER'S CURRENT POSITION (if exists):
   - Small info box above widget:
     * "You currently hold: {X} {YES/NO} shares (cost: ◎{cost})"
     * Fetch from useUserPositions hook

3. ACTION BUTTON:
   - Large, full-width button
   - States:
     * Not connected: "Connect Wallet" (purple) → opens wallet modal
     * Connected, no amount: "Enter Amount" (disabled, gray)
     * Connected, invalid amount: "Invalid Amount" (disabled, gray)
     * Connected, valid amount: "Place Bet on {YES/NO}" (blue/green/red)
     * Market closed: "Trading Closed" (disabled, gray)
     * After resolution date: "Market Resolved" (disabled, gray)
   - For now, onClick just shows a toast: "Blockchain integration coming next!"

4. Create calculation utilities in `/client/src/lib/calculations.ts`:
   ```typescript
   export function calculateNewPoolRatio(
     currentYesPool: number,
     currentNoPool: number,
     betAmount: number,
     betOutcome: 'yes' | 'no'
   ): { yesPercent: number; noPercent: number }

   export function calculatePotentialPayout(
     betAmount: number,
     betOutcome: 'yes' | 'no',
     currentYesPool: number,
     currentNoPool: number
   ): { payout: number; profit: number; profitPercent: number }
   ```

5. Validation logic:
   - Use Zod schema for amount validation
   - Validate on input change (debounced by 300ms)
   - Show inline errors immediately

6. Use useBalance hook:
   - Get user's SOL balance
   - Use for validation and "Max" button

7. Styling:
   - Use Shadcn Input, Button, Tabs, Card components
   - Consistent spacing (space-y-4)
   - Success/profit values in green
   - Danger/loss values in red
   - Highlight selected outcome tab

This widget is fully functional UI-wise with all calculations, but doesn't actually submit transactions yet. That will be added in the next prompt.
```

---

## Prompt 10: Transaction System - Notifications & Error Handling

```
Create the transaction notification system and error handling framework (without actual blockchain transactions yet).

Reference: design-notes.md Section 3.C (Transaction Status) and requirements.md REQ-NOTIF-001 to REQ-NOTIF-009, REQ-ERROR-001 to REQ-ERROR-008

1. Create `/client/src/hooks/useTransactionToast.ts`:
   - Custom hook that wraps Shadcn toast
   - Export functions:
     * `showPendingToast(signature: string)` - non-dismissible
     * `showSuccessToast(message: string, signature?: string)` - auto-dismiss 5s
     * `showErrorToast(message: string, error?: Error)` - auto-dismiss 10s
   - Each toast includes:
     * Appropriate icon (Loader2, CheckCircle, XCircle from lucide-react)
     * Title and description
     * Solscan link if signature provided (opens in new tab)
     * Format: `https://solscan.io/tx/${signature}?cluster=devnet`

2. Create `/client/src/lib/errors.ts`:
   - Parse and format blockchain error messages
   - Function: `parseTransactionError(error: Error): string`
   - Map common errors to user-friendly messages:
     * "Insufficient funds" → "You don't have enough SOL for this transaction"
     * "User rejected" → "You cancelled the transaction"
     * "Network error" → "Connection to Solana network failed. Please try again"
     * "Timeout" → "Transaction timed out after 30 seconds"
     * "Market closed" → "This market is no longer accepting bets"
     * Generic fallback: "Transaction failed. Please try again"

3. Create `/client/src/components/ErrorBoundary.tsx`:
   - React Error Boundary component
   - Catches errors in child components
   - Fallback UI:
     * Icon: AlertTriangle (red)
     * Message: "Something went wrong"
     * Details: Error message (in development mode only)
     * Button: "Reload Page" → window.location.reload()
   - Log errors to console
   - TODO: Add error reporting service in production

4. Update `/client/src/App.tsx`:
   - Wrap entire app with ErrorBoundary
   - Wrap each route with error boundary

5. Create `/client/src/hooks/useAirdrop.ts`:
   - Implements the "Airdrop 1 SOL" functionality
   - Uses connection.requestAirdrop(publicKey, LAMPORTS_PER_SOL)
   - Returns: { airdrop: () => Promise<void>, isAirdropping: boolean }
   - Flow:
     1. Set isAirdropping = true
     2. Show pending toast: "Requesting airdrop..."
     3. Call requestAirdrop()
     4. Wait for confirmation
     5. Show success toast: "1 SOL airdropped!"
     6. Invalidate balance query (refetch balance)
     7. Set isAirdropping = false
   - Error handling:
     * Rate limit: "Airdrop rate limited. Try again in a few minutes"
     * Network error: "Airdrop failed. Please try again"
     * Parse errors with parseTransactionError()

6. Update `/client/src/components/wallet/WalletButton.tsx`:
   - Import useAirdrop hook
   - Wire up "Airdrop 1 SOL" button:
     * Disable while isAirdropping
     * Show loading spinner when airdropping
     * Call airdrop() function on click
   - Add tooltip: "Get free Devnet SOL for testing"

7. Create `/client/src/components/LoadingStates.tsx`:
   - Export reusable loading components:
     * `MarketCardSkeleton` - skeleton for market card
     * `MarketDetailSkeleton` - skeleton for market detail page
     * `PageLoader` - full-page loading spinner
   - Use Shadcn Skeleton component
   - Match the layout of actual components

8. Create `/client/src/components/EmptyStates.tsx`:
   - Export reusable empty state components:
     * `NoMarkets` - "No markets found" with "Create Market" button
     * `NoPositions` - "You haven't placed any bets yet" with "Explore Markets" button
     * `NoTransactions` - "Your bets will appear here"
   - Each includes:
     * Icon from lucide-react
     * Title (text-lg font-semibold)
     * Description (text-sm text-muted-foreground)
     * Optional call-to-action button

9. Test the notification system:
   - In TradingWidget, update the "Place Bet" button onClick:
     ```typescript
     const handlePlaceBet = async () => {
       try {
         // Simulate transaction flow
         const mockSignature = "5Gx7...k3Pm" + Date.now();
         
         // Show pending
         showPendingToast(mockSignature);
         
         // Simulate network delay
         await new Promise(resolve => setTimeout(resolve, 2000));
         
         // Randomly succeed or fail (for testing)
         if (Math.random() > 0.3) {
           showSuccessToast("Bet placed successfully!", mockSignature);
         } else {
           throw new Error("Insufficient funds");
         }
       } catch (error) {
         const message = parseTransactionError(error as Error);
         showErrorToast(message);
       }
     };
     ```

10. Create `/client/src/lib/retry.ts`:
    - Implement exponential backoff retry logic
    - Function: `retryWithBackoff<T>(fn: () => Promise<T>, maxAttempts = 3): Promise<T>`
    - Used for RPC calls that may fail temporarily
    - Waits: 1s, 2s, 4s between retries

All toast notifications should be tested with both light and dark modes.
Error messages should be clear, actionable, and user-friendly.
Loading states should appear immediately (no blank screens).

This completes the transaction notification framework. The next step would be integrating actual blockchain transactions.
```

---

## Summary & Next Steps

These 10 prompts establish:

✅ **Prompt 1-2:** Project foundation (setup, types, constants, utilities)
✅ **Prompt 3:** Blockchain connection layer (Solana + Wallet adapters)
✅ **Prompt 4-5:** UI shell (Layout, navigation, routing, empty pages)
✅ **Prompt 6:** Data layer with mock data (hooks for fetching markets/positions)
✅ **Prompt 7:** Market listing dashboard (filters, sorting, cards)
✅ **Prompt 8:** Market detail page (info, stats, chart placeholder)
✅ **Prompt 9:** Trading widget UI (calculations, validation, no transactions)
✅ **Prompt 10:** Transaction notifications & error handling system

### After These 10 Prompts, You'll Have:
- Fully functional UI with mock data
- Complete navigation and routing
- Wallet connection working
- Trading calculations accurate
- Notification system ready
- Error handling framework in place

### Next Prompts (11-20) Would Cover:
11. Actual blockchain transaction integration (place bet)
12. Market creation form with validation
13. Portfolio view implementation
14. Transaction history display
15. Market resolution functionality (for resolvers)
16. Claiming winnings after resolution
17. Real-time updates via WebSocket subscriptions
18. Historical chart data (if tracked on-chain)
19. Recent trades/activity feed
20. Final polish, accessibility improvements, testing

**Key Strategy:** Build UI first with mock data, then progressively replace mocks with real blockchain calls. This allows rapid iteration and testing without depending on deployed smart contracts initially.
