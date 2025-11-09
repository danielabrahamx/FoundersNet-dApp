# FoundersNet dApp - AI Agent Build Prompts Sequence

This document provides the first 10 prompts to guide an AI coding agent through building the FoundersNet dApp, ordered for optimal dependency management and incremental functionality.

---

## Prompt 1: Project Initialization & Configuration

```

Initialize the FoundersNet dApp project with the following structure:

Please review the following files in my projects directory:
claude.md
tech-stack.md
design-notes.md
requirements.md

Then:
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

# FoundersNet dApp - Build Prompts 11-20

This document provides prompts 11-20 for implementing blockchain integration, real-time features, and final polish.

---

## Prompt 11: Development Server Setup & Live Testing

```
Set up the development server and create a comprehensive testing guide.

Reference: tech-stack.md Section 14 (Development Workflow)

1. **Create package.json scripts** (if not already present):
   ```json
   {
     "scripts": {
       "dev": "vite --host",
       "build": "tsc && vite build",
       "preview": "vite preview",
       "type-check": "tsc --noEmit"
     }
   }
   ```

2. **Create `/client/README.md`** with complete setup instructions:
   
   ### Installation & Setup
   - Prerequisites: Node.js 20+, pnpm/npm, Solana wallet extension
   - Installation: `cd client && pnpm install`
   - Environment: Copy `.env.example` to `.env` and configure
   
   ### Running Development Server
   ```bash
   cd client
   pnpm dev
   ```
   Server will start at `http://localhost:5173`
   
   ### Manual Testing Checklist
   Include comprehensive test cases for:
   - Wallet connection (connect/disconnect/airdrop)
   - Navigation between all pages
   - Market listing (filters, sorting)
   - Market detail view
   - Trading widget calculations
   - Notification system
   - Responsive design (test at 375px, 768px, 1440px)
   - Dark mode toggle
   
   ### Common Issues & Solutions
   - Port conflicts: How to kill process on 5173
   - Module errors: Clean install commands
   - TypeScript errors: Type checking command

3. **Create `/client/.env.example`**:
   ```
   VITE_SOLANA_NETWORK=devnet
   VITE_SOLANA_RPC_ENDPOINT=https://api.devnet.solana.com
   VITE_PROGRAM_ID=placeholder_will_be_updated_after_deployment
   ```

4. **Create `/client/.gitignore`**:
   ```
   node_modules
   dist
   .env
   .env.local
   .DS_Store
   *.log
   ```

5. **Start the development server**:
   - Run: `cd client && pnpm dev`
   - Verify it starts without errors
   - Open `http://localhost:5173` in browser
   - Check console for any errors
   - Verify app loads with all mock data working

**DELIVERABLE:** Development server running successfully at localhost:5173 with all features from prompts 1-10 working with mock data.
```

---

## Prompt 12: Anchor Program Integration - Fetch Real Data

```
Replace all mock data with real blockchain queries from the deployed Anchor program.

**PREREQUISITE:** Anchor program must be deployed to Devnet with Program ID available.

Reference: tech-stack.md Section 7 (Integration Strategy)

1. **Update `/client/.env`**:
   - Set `VITE_PROGRAM_ID` to your deployed program's actual address
   - Verify `VITE_SOLANA_RPC_ENDPOINT` is correct

2. **Add the actual Anchor IDL**:
   - Copy IDL from `anchor/target/idl/foundersnet.json`
   - Create `/client/src/idl/foundersnet.ts`:
     ```typescript
     export type FoundersnetIDL = {
       // Paste your complete IDL type here
     };
     
     export const IDL: FoundersnetIDL = {
       // Paste your complete IDL JSON here
     };
     ```

3. **Update `/client/src/lib/anchor.ts`**:
   - Remove placeholder IDL
   - Import real IDL: `import { IDL } from '@/idl/foundersnet'`
   - Update `getProgram()` to use real IDL and program ID from env

4. **Update `/client/src/hooks/useMarkets.ts`**:
   - Remove `MOCK_MARKETS` array completely
   - Implement real query:
     ```typescript
     queryFn: async () => {
       if (!program) return [];
       const accounts = await program.account.market.all();
       return accounts.map(acc => ({
         publicKey: acc.publicKey,
         title: acc.account.title,
         description: acc.account.description,
         // ... map all fields from IDL to Market type
         yesPool: acc.account.yesPool.toNumber(),
         noPool: acc.account.noPool.toNumber(),
         resolutionDate: acc.account.resolutionDate.toNumber(),
         // ... etc
       }));
     }
     ```

5. **Update `/client/src/hooks/useMarket.ts`**:
   - Remove mock data
   - Fetch single market: `await program.account.market.fetch(marketPubkey)`

6. **Update `/client/src/hooks/useUserPositions.ts`**:
   - Remove mock data
   - Fetch positions using PDA filter:
     ```typescript
     const positions = await program.account.userPosition.all([
       {
         memcmp: {
           offset: 8, // After discriminator
           bytes: publicKey.toBase58(),
         },
       },
     ]);
     ```

7. **Add error handling**:
   - Wrap all RPC calls in try-catch
   - Use `retryWithBackoff()` for transient failures
   - Show user-friendly error messages

8. **Test with real blockchain**:
   - If no markets exist, create one manually via Anchor CLI
   - Verify markets load from Devnet
   - Check browser console for RPC calls
   - Monitor Network tab for performance

**DELIVERABLE:** Application displays real on-chain data. Markets, positions, and balances all fetched from Solana Devnet.
```

---

## Prompt 13: Place Bet Transaction - Write to Blockchain

```
Implement the "Place Bet" transaction that writes to the Solana blockchain.

Reference: design-notes.md Section 5 (Transaction Execution Pattern)

1. **Create `/client/src/hooks/usePlaceBet.ts`**:
   ```typescript
   import { useMutation, useQueryClient } from '@tanstack/react-query';
   import { BN } from '@coral-xyz/anchor';
   
   export function usePlaceBet() {
     const program = useProgram();
     const { publicKey } = useWallet();
     const queryClient = useQueryClient();
     const { showPendingToast, showSuccessToast, showErrorToast } = useTransactionToast();
     
     return useMutation({
       mutationFn: async ({ marketId, amount, outcome }: {
         marketId: string;
         amount: number; // SOL
         outcome: 'yes' | 'no';
       }) => {
         if (!program || !publicKey) throw new Error('Wallet not connected');
         
         const marketPubkey = new PublicKey(marketId);
         const amountLamports = new BN(solToLamports(amount));
         
         // Derive user position PDA
         const [userPositionPDA] = PublicKey.findProgramAddressSync(
           [
             Buffer.from('user_position'),
             publicKey.toBuffer(),
             marketPubkey.toBuffer(),
           ],
           program.programId
         );
         
         // Call place_bet instruction
         const signature = await program.methods
           .placeBet(
             amountLamports,
             outcome === 'yes' ? { yes: {} } : { no: {} }
           )
           .accounts({
             market: marketPubkey,
             userPosition: userPositionPDA,
             user: publicKey,
             systemProgram: SystemProgram.programId,
           })
           .rpc();
         
         return signature;
       },
       onSuccess: (signature) => {
         showSuccessToast('Bet placed successfully!', signature);
         // Refetch data
         queryClient.invalidateQueries({ queryKey: ['markets'] });
         queryClient.invalidateQueries({ queryKey: ['positions'] });
         queryClient.invalidateQueries({ queryKey: ['balance'] });
       },
       onError: (error) => {
         const message = parseTransactionError(error as Error);
         showErrorToast('Failed to place bet', error as Error);
       },
     });
   }
   ```

2. **Update `/client/src/components/market/TradingWidget.tsx`**:
   - Remove mock transaction code
   - Import and use `usePlaceBet` hook
   - Update button onClick:
     ```typescript
     const { mutate: placeBet, isPending } = usePlaceBet();
     
     const handlePlaceBet = () => {
       if (!amount || !selectedOutcome) return;
       placeBet({
         marketId: market.publicKey.toString(),
         amount: parseFloat(amount),
         outcome: selectedOutcome,
       });
     };
     ```
   - Show loading state while `isPending` is true
   - Disable button and show spinner during transaction

3. **Add transaction confirmation**:
   - After RPC call, show pending toast with signature
   - Poll for confirmation using `connection.confirmTransaction()`
   - Update toast to success after confirmation
   - Handle 30 second timeout

4. **Add pre-flight checks**:
   - Validate market is still open
   - Check resolution date hasn't passed
   - Verify sufficient balance (including fees)

5. **Test full transaction flow**:
   ```
   Testing Steps:
   1. Ensure you have Devnet SOL (use Airdrop)
   2. Navigate to market detail
   3. Enter bet amount (e.g., 0.1 SOL)
   4. Select YES or NO
   5. Click "Place Bet"
   6. Approve in wallet popup
   7. Verify pending notification appears
   8. Wait ~2 seconds for confirmation
   9. Verify success notification
   10. Refresh and check pool sizes updated
   11. Check Portfolio - position should appear
   ```

**DELIVERABLE:** Users can place real bets that write to Solana Devnet. Transactions confirmed on-chain. Pool sizes update. Positions tracked.
```

---

## Prompt 14: Market Creation Form

```
Implement the Create Market form with full validation and blockchain integration.

Reference: design-notes.md Section 3.D (Create Market View)

1. **Create Zod validation schema `/client/src/lib/validations/marketSchema.ts`**:
   ```typescript
   import { z } from 'zod';
   
   export const marketSchema = z.object({
     title: z.string()
       .min(10, 'Title must be at least 10 characters')
       .max(200, 'Title must be less than 200 characters'),
     
     category: z.enum(['Sports', 'Politics', 'Crypto', 'Entertainment', 'Other']),
     
     description: z.string()
       .min(50, 'Description must be at least 50 characters')
       .max(1000, 'Description must be less than 1000 characters'),
     
     resolutionDate: z.date()
       .refine(date => date > new Date(), 'Must be in the future')
       .refine(date => {
         const oneYearFromNow = new Date();
         oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
         return date <= oneYearFromNow;
       }, 'Must be within 1 year'),
     
     initialLiquidity: z.number()
       .min(0.5, 'Minimum liquidity is 0.5 SOL')
       .max(1000, 'Maximum liquidity is 1000 SOL'),
   });
   
   export type MarketFormData = z.infer<typeof marketSchema>;
   ```

2. **Create `/client/src/hooks/useCreateMarket.ts`**:
   ```typescript
   export function useCreateMarket() {
     const program = useProgram();
     const { publicKey } = useWallet();
     const queryClient = useQueryClient();
     const navigate = useNavigate();
     const { showSuccessToast, showErrorToast } = useTransactionToast();
     
     return useMutation({
       mutationFn: async (data: MarketFormData) => {
         if (!program || !publicKey) throw new Error('Wallet not connected');
         
         const marketKeypair = Keypair.generate();
         const resolutionTimestamp = new BN(Math.floor(data.resolutionDate.getTime() / 1000));
         const liquidityLamports = new BN(solToLamports(data.initialLiquidity));
         
         const signature = await program.methods
           .createMarket(
             data.title,
             data.description,
             data.category,
             resolutionTimestamp,
             liquidityLamports
           )
           .accounts({
             market: marketKeypair.publicKey,
             creator: publicKey,
             systemProgram: SystemProgram.programId,
           })
           .signers([marketKeypair])
           .rpc();
         
         return { signature, marketId: marketKeypair.publicKey.toString() };
       },
       onSuccess: ({ signature, marketId }) => {
         showSuccessToast('Market created!', signature);
         queryClient.invalidateQueries({ queryKey: ['markets'] });
         navigate(`/market/${marketId}`);
       },
       onError: (error) => {
         showErrorToast('Failed to create market', error as Error);
       },
     });
   }
   ```

3. **Update `/client/src/pages/Create.tsx`**:
   - Build full form using Shadcn Form components
   - Use react-hook-form with Zod resolver
   - Include all fields: Title, Category, Description, Resolution Date, Initial Liquidity
   - Add character counters for text fields
   - Use date picker (Shadcn Calendar) for resolution date
   - Show estimated costs: "◎0.5 + ◎0.002 (fees)"
   - Validate against user balance before submit
   - Submit button: "Create Market" with loading state

4. **Install required dependencies**:
   ```bash
   pnpm add react-hook-form @hookform/resolvers date-fns react-day-picker
   ```

5. **Add Shadcn components**:
   ```bash
   npx shadcn-ui@latest add form textarea calendar popover
   ```

6. **Test market creation**:
   - Fill all fields with valid data
   - Test validation (try invalid title length, past date, etc.)
   - Submit and approve in wallet
   - Verify redirect to new market
   - Check market appears in listings

**DELIVERABLE:** Users can create new prediction markets on Devnet with full validation and proper error handling.
```

---

## Prompt 15: Portfolio View with P&L Calculations

```
Implement the Portfolio view showing positions, profit/loss, and transaction history.

Reference: design-notes.md Section 3.C (Portfolio View)

1. **Create `/client/src/components/portfolio/PortfolioSummary.tsx`**:
   - Calculate total portfolio value (sum of all position potential payouts)
   - Calculate total cost basis (sum of all position costs)
   - Calculate total P&L: `totalValue - totalCost`
   - Calculate win rate: `(wins / resolvedPositions) * 100`
   - Display in card with 3 columns:
     * Total Value
     * Total P&L (green/red color-coded with percentage)
     * Win Rate (with ratio)

2. **Create `/client/src/components/portfolio/PositionCard.tsx`**:
   - Show market title, status badge, outcome badge
   - Display: Shares, Cost Basis, Current Value, P&L
   - Calculate current value:
     * For open markets: potential payout if won
     * For resolved markets: actual winnings or 0
   - Color-code P&L (green profit, red loss)
   - Make card clickable → navigate to market detail
   - Add "Claim Winnings" button for resolved winning positions (placeholder for now)

3. **Create `/client/src/components/portfolio/TransactionHistory.tsx`**:
   - Show list of all bets placed
   - Each row: Date, Market name, Amount, Solscan link
   - For MVP: derive from positions (one entry per position)
   - Future: could fetch from blockchain explorer API

4. **Update `/client/src/pages/Portfolio.tsx`**:
   - Check wallet connected (redirect if not)
   - Fetch positions with `useUserPositions()`
   - Fetch all markets to get market details
   - Create Map of marketId → Market for lookups
   - Add filter dropdown: All / Open / Resolved
   - Layout:
     * PortfolioSummary at top
     * "Your Positions" section with grid of PositionCards
     * TransactionHistory at bottom
   - Empty state: "No positions yet. Explore markets!"

5. **Add helper function in `/client/src/lib/calculations.ts`**:
   ```typescript
   export function calculatePositionValue(
     position: UserPosition,
     market: Market
   ): { currentValue: number; pnl: number; pnlPercent: number } {
     const cost = lamportsToSol(position.totalCost);
     let currentValue = 0;
     
     if (market.status === MarketStatus.Resolved) {
       // Calculate actual winnings based on outcome
       const yesShares = lamportsToSol(position.yesShares);
       const noShares = lamportsToSol(position.noShares);
       const totalPool = lamportsToSol(market.yesPool + market.noPool);
       
       if (market.outcome === MarketOutcome.Yes && yesShares > 0) {
         const totalYesShares = lamportsToSol(market.yesPool);
         currentValue = (yesShares / totalYesShares) * totalPool;
       } else if (market.outcome === MarketOutcome.No && noShares > 0) {
         const totalNoShares = lamportsToSol(market.noPool);
         currentValue = (noShares / totalNoShares) * totalPool;
       } else if (market.outcome === MarketOutcome.Invalid) {
         currentValue = cost; // Refund
       }
     } else {
       // For open markets, show optimistic value
       const yesShares = lamportsToSol(position.yesShares);
       const noShares = lamportsToSol(position.noShares);
       
       if (yesShares > 0) {
         currentValue = calculatePotentialPayout(
           yesShares, 'yes',
           lamportsToSol(market.yesPool),
           lamportsToSol(market.noPool)
         ).payout;
       } else if (noShares > 0) {
         currentValue = calculatePotentialPayout(
           noShares, 'no',
           lamportsToSol(market.yesPool),
           lamportsToSol(market.noPool)
         ).payout;
       }
     }
     
     const pnl = currentValue - cost;
     const pnlPercent = cost > 0 ? (pnl / cost) * 100 : 0;
     
     return { currentValue, pnl, pnlPercent };
   }
   ```

6. **Test portfolio view**:
   - Place bets on 2-3 different markets
   - Navigate to Portfolio
   - Verify calculations are accurate
   - Test filter dropdown
   - Click position cards and verify navigation

**DELIVERABLE:** Comprehensive portfolio view with accurate P&L calculations and transaction history.
```

---

## Prompt 16: Market Resolution & Claiming Winnings

```
Implement market resolution (for resolvers) and claiming winnings (for winners).

Reference: requirements.md REQ-MARKET-013, REQ-POSITION-006

1. **Create `/client/src/hooks/useResolveMarket.ts`**:
   ```typescript
   export function useResolveMarket() {
     const program = useProgram();
     const { publicKey } = useWallet();
     const queryClient = useQueryClient();
     const { showSuccessToast, showErrorToast } = useTransactionToast();
     
     return useMutation({
       mutationFn: async ({ marketId, outcome }: {
         marketId: string;
         outcome: 'yes' | 'no' | 'invalid';
       }) => {
         if (!program || !publicKey) throw new Error('Wallet not connected');
         
         const marketPubkey = new PublicKey(marketId);
         let outcomeEnum;
         if (outcome === 'yes') outcomeEnum = { yes: {} };
         else if (outcome === 'no') outcomeEnum = { no: {} };
         else outcomeEnum = { invalid: {} };
         
         const signature = await program.methods
           .resolveMarket(outcomeEnum)
           .accounts({
             market: marketPubkey,
             resolver: publicKey,
           })
           .rpc();
         
         return signature;
       },
       onSuccess: (signature) => {
         showSuccessToast('Market resolved!', signature);
         queryClient.invalidateQueries({ queryKey: ['markets'] });
       },
       onError: (error) => {
         showErrorToast('Failed to resolve market', error as Error);
       },
     });
   }
   ```

2. **Create `/client/src/hooks/useClaimWinnings.ts`**:
   ```typescript
   export function useClaimWinnings() {
     const program = useProgram();
     const { publicKey } = useWallet();
     const queryClient = useQueryClient();
     const { showSuccessToast, showErrorToast } = useTransactionToast();
     
     return useMutation({
       mutationFn: async ({ marketId }: { marketId: string }) => {
         if (!program || !publicKey) throw new Error('Wallet not connected');
         
         const marketPubkey = new PublicKey(marketId);
         const [userPositionPDA] = PublicKey.findProgramAddressSync(
           [
             Buffer.from('user_position'),
             publicKey.toBuffer(),
             marketPubkey.toBuffer(),
           ],
           program.programId
         );
         
         const signature = await program.methods
           .claimWinnings()
           .accounts({
             market: marketPubkey,
             userPosition: userPositionPDA,
             user: publicKey,
           })
           .rpc();
         
         return signature;
       },
       onSuccess: (signature) => {
         showSuccessToast('Winnings claimed!', signature);
         queryClient.invalidateQueries({ queryKey: ['positions'] });
         queryClient.invalidateQueries({ queryKey: ['balance'] });
       },
       onError: (error) => {
         showErrorToast('Failed to claim winnings', error as Error);
       },
     });
   }
   ```

3. **Create `/client/src/components/market/ResolveMarketDialog.tsx`**:
   - Dialog with radio buttons: YES wins / NO wins / Invalid
   - Warning message: "This action is permanent"
   - Only show if:
     * User is the resolver
     * Current time > resolution date
     * Market not already resolved
   - Submit button calls `useResolveMarket`

4. **Update `/client/src/pages/MarketDetail.tsx`**:
   - Add <ResolveMarketDialog> component
   - Show resolved outcome badge if resolved
   - Disable trading widget if resolved

5. **Update `/client/src/components/portfolio/PositionCard.tsx`**:
   - Replace "Claim Winnings" button placeholder
   - Import `useClaimWinnings`
   - Wire up onClick: `claimWinnings({ marketId })`
   - Show loading state while claiming

6. **Test resolution flow**:
   - Create market with past resolution date (for testing)
   - As resolver, click "Resolve Market"
   - Select outcome and confirm
   - Verify market updates to resolved status
   - As winner, go to Portfolio
   - Click "Claim Winnings"
   - Verify SOL transferred to wallet

**DELIVERABLE:** Complete betting lifecycle - resolvers can resolve markets, winners can claim payouts.
```

---

## Prompt 17: Real-time Updates with WebSocket

```
Add WebSocket subscriptions for live market updates without manual refresh.

Reference: requirements.md REQ-DATA-005

1. **Create `/client/src/hooks/useAccountSubscription.ts`**:
   ```typescript
   import { useEffect } from 'react';
   import { PublicKey } from '@solana/web3.js';
   import { connection } from '@/lib/solana';
   import { useQueryClient } from '@tanstack/react-query';
   
   export function useAccountSubscription(
     accountPubkey: PublicKey | null | undefined,
     queryKey: string[]
   ) {
     const queryClient = useQueryClient();
     
     useEffect(() => {
       if (!accountPubkey) return;
       
       const subscriptionId = connection.onAccountChange(
         accountPubkey,
         () => {
           // Invalidate queries to trigger refetch
           queryClient.invalidateQueries({ queryKey });
         },
         'confirmed'
       );
       
       return () => {
         connection.removeAccountChangeListener(subscriptionId);
       };
     }, [accountPubkey?.toString(), queryClient]);
   }
   ```

2. **Update `/client/src/pages/MarketDetail.tsx`**:
   - Add subscription for live updates:
     ```typescript
     const { data: market } = useMarket(marketId);
     
     useAccountSubscription(
       market?.publicKey,
       ['market', marketId]
     );
     ```

3. **Create `/client/src/components/LiveIndicator.tsx`**:
   ```tsx
   export function LiveIndicator() {
     return (
       <div className="flex items-center gap-2 text-xs text-muted-foreground">
         <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
         <span>Live</span>
       </div>
     );
   }
   ```

4. **Add LiveIndicator to MarketDetail**:
   - Display near market title or in stats card
   - Shows user that data updates automatically

5. **Optimize subscriptions**:
   - Only subscribe to currently visible markets
   - Clean up on component unmount
   - Debounce rapid updates (max 1 refetch per 2 seconds)

6. **Test real-time updates**:
   - Open market in one browser tab
   - Place bet from another tab
   - Verify first tab updates automatically (no refresh)
   - Check console for subscription logs

**DELIVERABLE:** Markets update in real-time as bets are placed. No manual refresh needed.
```

---

## Prompt 18: Enhanced Pool Distribution Chart

```
Implement a proper chart showing pool sizes over time using Recharts.

Reference: design-notes.md REQ-CHART requirements

1. **Create `/client/src/lib/chartData.ts`**:
   - Since on-chain historical data isn't stored, create client-side snapshots:
     ```typescript
     interface PoolSnapshot {
       timestamp: number;
       yesPool: number;
       noPool: number;
       totalPool: number;
     }
     
     // In-memory storage (would use localStorage in production, but not available in artifacts)
     const marketSnapshots = new Map<string, PoolSnapshot[]>();
     
     export function addPoolSnapshot(marketId: string, market: Market) {
       const snapshot: PoolSnapshot = {
         timestamp: Date.now(),
         yesPool: lamportsToSol(market.yesPool),
         noPool: lamportsToSol(market.noPool),
         totalPool: lamportsToSol(market.yesPool + market.noPool),
       };
       
       const existing = marketSnapshots.get(marketId) || [];
       existing.push(snapshot);
       
       // Keep last 100 snapshots
       if (existing.length > 100) existing.shift();
       
       marketSnapshots.set(marketId, existing);
     }
     
     export function getPoolSnapshots(
       marketId: string,
       timeframe: '1h' | '24h' | '7d' | 'all'
     ): PoolSnapshot[] {
       const snapshots = marketSnapshots.get(marketId) || [];
       const now = Date.now();
       const cutoff = {
         '1h': now - 3600000,
         '24h': now - 86400000,
         '7d': now - 604800000,
         'all': 0,
       }[timeframe];
       
       return snapshots.filter(s => s.timestamp >= cutoff);
     }
     ```

2. **Update `/client/src/components/market/PoolChart.tsx`**:
   - Replace placeholder with full implementation:
     ```tsx
     import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
     
     export function PoolChart({ market }: { market: Market }) {
       const [timeframe, setTimeframe] = useState<'1h' | '24h' | '7d' | 'all'>('24h');
       
       // Add snapshot when market data changes
       useEffect(() => {
         addPoolSnapshot(market.publicKey.toString(), market);
       }, [market.yesPool, market.noPool]);
       
       const snapshots = getPoolSnapshots(market.publicKey.toString(), timeframe);
       
       const chartData = snapshots.map(s => ({
         time: s.timestamp,
         YES: s.yesPool,
         NO: s.noPool,
       }));
       
       return (
         <Card className="p-4">
           <div className="flex justify-between mb-4">
             <h3 className="font-semibold">Pool Distribution</h3>
             <Tabs value={timeframe} onValueChange={v => setTimeframe(v as any)}>
               <TabsList>
                 <TabsTrigger value="1h">1H</TabsTrigger>
                 <TabsTrigger value="24h">24H</TabsTrigger>
                 <TabsTrigger value="7d">7D</TabsTrigger>
                 <TabsTrigger value="all">All</TabsTrigger>
               </TabsList>
             </Tabs>
           </div>
           
           <ResponsiveContainer width="100%" height={250}>
             <LineChart data={chartData}>
               <CartesianGrid strokeDasharray="3 3" />
               <XAxis 
                 dataKey="time" 
                 tickFormatter={(time) => format(new Date(time), 'HH:mm')}
               />
               <YAxis />
               <Tooltip 
                 labelFormatter={(time) => format(new Date(time), 'MMM d, HH:mm')}
                 formatter={(value) => formatSol(value as number)}
               />
               <Line type="monotone" dataKey="YES" stroke="#22c55e" strokeWidth={2} />
               <Line type="monotone" dataKey="NO" stroke="#ef4444" strokeWidth={2} />
             </LineChart>
           </ResponsiveContainer>
         </Card>
       );
     }
     ```

3. **Add to MarketDetail**:
   - Place chart in right column above MarketStats

4. **Test chart**:
   - View market detail page
   - Place a few bets
   - Watch chart update in real-time
   - Switch timeframe tabs

**DELIVERABLE:** Interactive chart showing pool distribution changes over time.
```

---

## Prompt 19: Polish & Accessibility Improvements

```
Add final polish, accessibility improvements, and edge case handling.

Reference: design-notes.md Section 11 (Accessibility)

```
Add final polish, accessibility improvements, and edge case handling.

Reference: design-notes.md Section 11 (Accessibility)

1. **Add loading skeletons everywhere**:
   - Update all pages to show proper skeleton screens while loading
   - Replace all spinners with Shadcn Skeleton components
   - Match skeleton layout to actual content layout

2. **Improve empty states**:
   - Create `/client/src/components/EmptyState.tsx`:
     ```tsx
     interface EmptyStateProps {
       icon: LucideIcon;
       title: string;
       description: string;
       action?: {
         label: string;
         onClick: () => void;
       };
     }
     
     export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
       return (
         <Card className="p-12 text-center">
           <Icon className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
           <h3 className="text-xl font-semibold mb-2">{title}</h3>
           <p className="text-muted-foreground mb-6">{description}</p>
           {action && (
             <Button onClick={action.onClick}>
               {action.label}
             </Button>
           )}
         </Card>
       );
     }
     ```
   - Use throughout: No markets, No positions, No transactions

3. **Add keyboard navigation**:
   - Ensure all interactive elements are tabbable
   - Add visible focus rings: `focus:ring-2 focus:ring-offset-2`
   - Test full app navigation using only Tab/Enter/Escape

4. **Improve form accessibility**:
   - Ensure all inputs have associated labels
   - Add aria-describedby for error messages
   - Add aria-invalid for fields with errors
   - Add aria-required for required fields

5. **Add ARIA labels where needed**:
   - IconButton components need aria-label
   - Images need alt text
   - Loading states need aria-live="polite"
   - Example:
     ```tsx
     <button aria-label="Toggle dark mode">
       <Moon className="w-5 h-5" />
     </button>
     ```

6. **Improve error boundaries**:
   - Update ErrorBoundary to show better fallback UI
   - Add "Go Home" and "Reload" buttons
   - Log errors with more context

7. **Add confirmation dialogs for destructive actions**:
   - Confirm before resolving market
   - Confirm before placing large bets (>1 SOL)

8. **Improve mobile experience**:
   - Test all pages at 375px width
   - Ensure buttons are min 44x44px (touch-friendly)
   - Make dropdowns and modals mobile-optimized
   - Add bottom sheet style for mobile filters

9. **Add tooltips for clarity**:
   - Install Shadcn Tooltip: `npx shadcn-ui@latest add tooltip`
   - Add to:
     * Devnet badge: "Using Solana Devnet. No real funds."
     * Pool percentages: "Implied odds based on pool ratio"
     * Resolution date: "Market closes for betting at this time"
     * Fees: "Solana network transaction fee"

10. **Improve copy/microcopy**:
    - Review all button labels (action-oriented)
    - Review all error messages (clear and actionable)
    - Review all empty states (encouraging)
    - Review all tooltips (concise and helpful)

11. **Add copy-to-clipboard for addresses**:
    - In wallet dropdown, add copy button next to full address
    - Show toast: "Address copied!"
    - Use Clipboard API

12. **Test dark mode thoroughly**:
    - Check all components in dark mode
    - Verify color contrast meets WCAG AA
    - Test charts in dark mode
    - Fix any readability issues

13. **Add meta tags in index.html**:
    ```html
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="description" content="FoundersNet - Decentralized prediction markets on Solana Devnet" />
      <title>FoundersNet | Prediction Markets on Solana</title>
    </head>
    ```

14. **Final testing checklist**:
    - [ ] All features work end-to-end
    - [ ] No console errors
    - [ ] All buttons have hover states
    - [ ] All links open correctly
    - [ ] All forms validate properly
    - [ ] All transactions complete successfully
    - [ ] Responsive at all breakpoints
    - [ ] Keyboard navigation works
    - [ ] Dark mode works
    - [ ] Error handling works
    - [ ] Loading states appear correctly
    - [ ] Empty states are helpful

**DELIVERABLE:** Polished, accessible application ready for user testing.
```

---

## Prompt 20: Final Testing, Documentation & Deployment Prep

```
Perform comprehensive testing, update documentation, and prepare for deployment.

Reference: tech-stack.md Section 16 (Deployment Strategy)

1. **Create comprehensive test plan document**:
   - Create `/client/TESTING.md`:
     ```markdown
     # FoundersNet Testing Guide
     
     ## Automated Tests
     (For future implementation)
     - Unit tests: Components and utility functions
     - Integration tests: User flows
     - E2E tests: Full betting lifecycle
     
     ## Manual Testing Checklist
     
     ### Critical User Flows
     
     #### Flow 1: First-time User Betting
     1. [ ] Connect wallet (Phantom)
     2. [ ] Airdrop 1 SOL
     3. [ ] Browse markets
     4. [ ] Click market card
     5. [ ] Enter bet amount
     6. [ ] Select outcome
     7. [ ] Place bet
     8. [ ] Wait for confirmation
     9. [ ] Check portfolio
     10. [ ] Verify position appears
     
     #### Flow 2: Creating a Market
     1. [ ] Navigate to Create
     2. [ ] Fill all fields
     3. [ ] Test validation
     4. [ ] Submit
     5. [ ] Approve in wallet
     6. [ ] Verify redirect
     7. [ ] Check market in listings
     
     #### Flow 3: Resolution & Claiming
     1. [ ] As resolver, resolve market
     2. [ ] Verify outcome displayed
     3. [ ] As winner, claim winnings
     4. [ ] Verify SOL received
     
     ### Edge Cases
     - [ ] Insufficient balance
     - [ ] Network errors
     - [ ] Wallet rejection
     - [ ] Market not found
     - [ ] Invalid market ID
     - [ ] Concurrent updates
     - [ ] Page refresh during transaction
     
     ### Performance Tests
     - [ ] Load 50+ markets
     - [ ] Multiple simultaneous users
     - [ ] Rapid navigation
     - [ ] WebSocket stress test
     
     ### Browser Compatibility
     - [ ] Chrome 120+
     - [ ] Firefox 120+
     - [ ] Safari 17+
     - [ ] Brave 1.60+
     
     ### Device Testing
     - [ ] Desktop (1920x1080)
     - [ ] Laptop (1366x768)
     - [ ] Tablet (768x1024)
     - [ ] Mobile (375x667)
     ```

2. **Update README.md with deployment instructions**:
   ```markdown
   ## Deployment
   
   ### Prerequisites
   - Anchor program deployed to Devnet
   - Program ID available
   - RPC endpoint configured
   
   ### Environment Variables
   Required variables for production:
   - VITE_SOLANA_NETWORK=devnet
   - VITE_SOLANA_RPC_ENDPOINT=your_rpc_endpoint
   - VITE_PROGRAM_ID=your_program_id
   
   ### Build for Production
   ```bash
   cd client
   pnpm build
   ```
   
   Output: `dist/` directory ready for deployment
   
   ### Deploy to Vercel
   ```bash
   vercel deploy --prod
   ```
   
   ### Deploy to Netlify
   ```bash
   netlify deploy --prod --dir=dist
   ```
   
   ### Deploy to Cloudflare Pages
   ```bash
   wrangler pages deploy dist
   ```
   ```

3. **Create `/client/ARCHITECTURE.md`**:
   - Document component structure
   - Explain data flow
   - List all hooks and their purposes
   - Explain WebSocket subscription strategy
   - Document calculation logic
   - Explain PDA derivation

4. **Add JSDoc comments to all utility functions**:
   - Document parameters, return types, examples
   - Especially for: calculations.ts, utils.ts, errors.ts

5. **Create `/client/CHANGELOG.md`**:
   ```markdown
   # Changelog
   
   ## [1.0.0] - 2025-01-XX
   
   ### Added
   - Wallet connection (Phantom, Solflare, Backpack)
   - Market listing with filters and sorting
   - Market detail view with trading widget
   - Place bet functionality
   - Market creation form
   - Portfolio view with P&L tracking
   - Market resolution
   - Claim winnings
   - Real-time updates via WebSocket
   - Pool distribution chart
   - Dark mode support
   - Responsive design
   - Devnet airdrop functionality
   
   ### Features
   - Pool-based betting mechanism
   - Automatic payout calculations
   - Live market updates
   - Transaction notifications
   - Error handling and recovery
   - Accessibility support
   ```

6. **Performance optimizations**:
   - Run `pnpm build` and check bundle size
   - Ensure main bundle < 500KB gzipped
   - Use code-splitting if needed
   - Optimize images (wallet logos)
   - Review and remove unused dependencies

7. **Security checklist**:
   - [ ] No private keys in code
   - [ ] No sensitive data in localStorage (N/A for artifacts)
   - [ ] All external links use rel="noopener noreferrer"
   - [ ] Input sanitization for user content
   - [ ] PDA derivation is correct
   - [ ] No hardcoded program IDs (use env vars)

8. **Final code review**:
   - [ ] No console.logs in production code
   - [ ] No TODO comments without tickets
   - [ ] All TypeScript errors resolved
   - [ ] All ESLint warnings addressed
   - [ ] Consistent code formatting
   - [ ] No unused imports
   - [ ] All magic numbers extracted to constants

9. **Create deployment checklist**:
   ```markdown
   ## Pre-Deployment Checklist
   
   - [ ] All tests pass
   - [ ] Production build succeeds
   - [ ] Environment variables configured
   - [ ] Anchor program deployed to Devnet
   - [ ] Program ID updated in .env
   - [ ] RPC endpoint tested and working
   - [ ] No console errors in production build
   - [ ] Bundle size acceptable (< 500KB)
   - [ ] All features tested on Devnet
   - [ ] Documentation updated
   - [ ] CHANGELOG updated
   
   ## Post-Deployment
   
   - [ ] Verify deployed site loads
   - [ ] Test wallet connection
   - [ ] Place a test bet
   - [ ] Create a test market
   - [ ] Check all pages work
   - [ ] Monitor error logs
   - [ ] Share with test users
   ```

10. **Run final comprehensive test**:
    - Start dev server: `pnpm dev`
    - Complete all test flows from TESTING.md
    - Test in multiple browsers
    - Test on mobile device (or Chrome DevTools)
    - Verify dark mode throughout
    - Test all error scenarios
    - Document any bugs found

11. **Create production build**:
    ```bash
    cd client
    pnpm build
    pnpm preview  # Test production build locally
    ```

12. **Measure performance**:
    - Use Lighthouse in Chrome DevTools
    - Target scores:
      * Performance: 90+
      * Accessibility: 95+
      * Best Practices: 90+
      * SEO: 90+
    - Fix any major issues found

13. **Document known limitations**:
    - Create `/client/LIMITATIONS.md`:
      ```markdown
      # Known Limitations (MVP)
      
      1. **Historical Data**: Pool history stored client-side only (resets on page refresh)
      2. **Transaction History**: Derived from positions, not complete blockchain history
      3. **Search**: No market search functionality yet
      4. **Notifications**: No email/push notifications
      5. **Mobile App**: Web only (no native app)
      6. **Advanced Charts**: Basic charts only (no depth charts)
      7. **Devnet Only**: Not production-ready for mainnet
      
      ## Future Enhancements
      - Blockchain indexer for historical data
      - Advanced filtering and search
      - Social features (comments, sharing)
      - Mobile app (React Native)
      - Mainnet deployment
      ```

14. **Final verification**:
    - [ ] Dev server runs: `pnpm dev` ✓
    - [ ] Production build works: `pnpm build` ✓
    - [ ] No TypeScript errors: `pnpm type-check` ✓
    - [ ] All documentation complete ✓
    - [ ] Testing guide created ✓
    - [ ] Ready for deployment ✓

**DELIVERABLE:** Production-ready application with complete documentation, testing guides, and deployment instructions. Ready to deploy to Vercel/Netlify/Cloudflare Pages.

---

## Summary: Prompts 11-20 Complete

After completing all 20 prompts, you will have:

✅ **Fully functional dApp** with all features working on Solana Devnet
✅ **Development server** running at localhost:5173 for live testing
✅ **Real blockchain integration** - reading and writing to Solana
✅ **Complete transaction lifecycle** - bet placement, resolution, claiming
✅ **Real-time updates** via WebSocket subscriptions
✅ **Polished UI** with accessibility, dark mode, responsive design
✅ **Comprehensive documentation** for deployment and maintenance
✅ **Production-ready build** ready to deploy

### Testing During Development

After each prompt, you should:
1. Run `pnpm dev` in the client directory
2. Open http://localhost:5173 in your browser
3. Test the new feature that was just implemented
4. Check browser console for any errors
5. Verify the feature works as expected before moving to next prompt

### Critical Testing Points

- **After Prompt 11**: Verify dev server starts and mock data displays
- **After Prompt 12**: Verify real blockchain data loads
- **After Prompt 13**: Place an actual bet on Devnet
- **After Prompt 14**: Create a real market on Devnet
- **After Prompt 15**: Check portfolio calculations are accurate
- **After Prompt 16**: Test full resolution and claiming flow
- **After Prompt 17**: Verify live updates work
- **After Prompt 20**: Complete all manual tests before deployment

The development server will be running throughout prompts 11-20, allowing you to test each feature immediately after implementation.
```
