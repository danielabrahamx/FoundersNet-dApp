# design-notes.md: FoundersNet (Minimalist Devnet dApp)

This document provides the comprehensive design blueprint for the FoundersNet dApp frontend, focusing on a clean, modern, and highly functional user interface for a decentralized prediction market on Solana Devnet.

## 1. Design Overview and Branding

The design will be **minimalist and data-focused**, prioritizing clarity and ease of use for financial transactions while maintaining a modern, trustworthy aesthetic.

### Color Palette

*   **Primary:** Deep blue (`#007bff`) for main actions (buttons, primary links, active states).
*   **Secondary:** Light gray/off-white (`#f8f9fa`) for backgrounds, cards, and secondary UI elements.
*   **Success/Profit:** Green (`#28a745`) for positive changes, profit indicators, and successful transactions.
*   **Danger/Loss:** Red (`#dc3545`) for negative changes, loss indicators, and errors.
*   **Accent:** Vibrant Solana purple (`#9945FF`) for blockchain-specific elements:
    - Wallet connection button (connected state)
    - Transaction status indicators
    - Solana-specific badges and icons
*   **Warning/Devnet:** Amber/yellow (`#fbbf24`) for Devnet mode indicator and cautionary messages.
*   **Neutral Text:** Dark gray (`#212529`) for primary text, light gray (`#6c757d`) for secondary text.
*   **Background (Dark Mode):** Dark slate (`#1e293b`) with slightly lighter cards (`#334155`).

### Typography

*   **Font Stack:** System font stack for optimal performance and native feel:
  ```css
  font-family: -apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', 
               'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
  ```
*   **Font Sizes (Tailwind classes):**
    - Large headers: `text-3xl` to `text-4xl` (30-36px)
    - Section headers: `text-xl` to `text-2xl` (20-24px)
    - Body text: `text-base` (16px)
    - Small text/labels: `text-sm` (14px)
    - Micro text (timestamps, footnotes): `text-xs` (12px)
*   **Font Weights:**
    - Regular: `font-normal` (400)
    - Medium: `font-medium` (500) for labels and subheadings
    - Semi-bold: `font-semibold` (600) for buttons and important data
    - Bold: `font-bold` (700) for primary headings

### Component Library

All components will be built using:
- **Shadcn UI** components (installed via CLI, customizable)
- **Radix UI** primitives (underlying foundation for Shadcn)
- **Tailwind CSS** for styling (use ONLY core utility classes, no custom CSS)
- **Lucide React** for all iconography

## 2. Global Layout

The application uses a standard single-page application layout optimized for desktop but fully responsive down to mobile.

### Header (Fixed Top Navigation)

**Layout:** Full-width, fixed position, backdrop blur for modern effect.

**Left Section:**
- Logo/App Name: "FoundersNet" with Solana icon
- Font: `text-xl font-bold`

**Center Section (Desktop only):**
- Primary Navigation Tabs:
  - "Markets" (default/home)
  - "Portfolio" (user's positions)
  - "Create" (create new market)
- Active state: Blue underline with purple accent
- Mobile: Collapse to hamburger menu

**Right Section:**
- **Devnet Indicator Badge:** 
  - Yellow/amber background (`bg-yellow-100 dark:bg-yellow-900`)
  - Text: "DEVNET MODE"
  - Always visible, non-dismissible
- **Theme Toggle:** Sun/moon icon button (light/dark mode)
- **Wallet Connection Button:**
  - **Disconnected State:** 
    - Purple background (`bg-purple-600`)
    - Text: "Connect Wallet"
    - Icon: Wallet icon from Lucide
  - **Connected State:**
    - Shows truncated address: `5Gx7...k3Pm` (first 3 + last 3 chars)
    - Shows SOL balance: `◎ 2.45` (with Solana symbol)
    - Dropdown on click:
      - Full address (copyable)
      - "Airdrop 1 SOL" button (Devnet only)
      - "Disconnect" button
      - Link to Solscan Explorer (Devnet)

### Main Content Area

- Full-width container with max-width constraint: `max-w-7xl mx-auto`
- Padding: `px-4 sm:px-6 lg:px-8`
- Background: Light mode (`bg-white`), Dark mode (`bg-slate-900`)

### Footer

**Minimalist design:**
- Text: `text-sm text-gray-500`
- Content: "Built on Solana Devnet | Docs | GitHub | Twitter"
- Links open in new tab
- Sticky at bottom, non-intrusive

## 3. Key UI/UX Components

### A. Market Listing View (Dashboard)

**Route:** `/` (home/default view)

**Layout:**
- **Top Bar:** 
  - Page title: "Active Markets" (`text-2xl font-bold`)
  - Filter/Sort controls (right-aligned):
    - Status filter: Dropdown (All, Open, Resolved)
    - Category filter: Dropdown (All, Sports, Politics, Crypto, etc.)
    - Sort: Dropdown (Volume ↓, Resolution Date ↑, Recently Created)

**Market Cards:**
- **Display Mode:**
  - **Desktop (lg+):** Data table with columns:
    - Title | Category | Resolves | Yes Price | No Price | Volume | 24h Change
  - **Mobile/Tablet (sm-md):** Card-based grid (1-2 columns)
    - Card shows: Title, Category badge, Resolution date, Current price, Volume

- **Data Points per Market:**
  - **Title:** Market question (e.g., "Will Bitcoin reach $100k by Dec 31?")
  - **Category Badge:** Small pill badge with category color
  - **Resolution Date:** Formatted as "Dec 31, 2025" or "Resolves in 5 days"
  - **Current Price:** 
    - "YES: ◎0.65" (65% implied probability)
    - "NO: ◎0.35" (35% implied probability)
  - **Total Volume:** "◎1,234.56" with SOL symbol
  - **24h Change:** "+5.2%" in green or "-2.1%" in red with trend arrow

- **Interaction:**
  - Entire row/card is clickable
  - Hover state: Slight elevation/shadow, cursor pointer
  - Click: Navigate to Market Detail View (`/market/:id`)

- **Loading State:**
  - Skeleton cards/rows while fetching from blockchain
  - Shimmer animation effect

- **Empty State:**
  - Message: "No markets found"
  - Action: "Create the first market" button (if wallet connected)

### B. Market Detail View (Trading Interface)

**Route:** `/market/:marketId`

**Layout:** Two-column layout on desktop (`lg:grid lg:grid-cols-3 lg:gap-8`)

#### Left Column (2/3 width on desktop)

**Market Header:**
- Market Title: Large, bold (`text-3xl font-bold`)
- Category Badge: Colored pill
- Status Indicator: "Open" (green) or "Resolved" (gray)
- Resolution Date: "Resolves on Dec 31, 2025, 11:59 PM UTC"

**Market Description:**
- Full text description (supports markdown formatting)
- Resolution criteria clearly stated
- Source links (if applicable)

**Trading Widget:**
- **Card Component** with elevated shadow
- **Header:** "Place Trade"
- **Outcome Selection:**
  - Two large radio buttons/tabs: "YES" (green) | "NO" (red)
  - Shows current price for selected outcome
- **Amount Input:**
  - Label: "Amount (SOL)"
  - Input: Number field with SOL symbol
  - Max button: "Max" (fills with wallet balance minus 0.01 SOL for fees)
  - Validation:
    - Min: 0.01 SOL
    - Max: Wallet balance - 0.01 SOL
    - Decimals: 2 places (lamports precision)
    - Error messages below input in red
- **Trade Summary:**
  - Current Price: "◎0.65 per share"
  - Shares to Receive: "1.54 shares" (calculated)
  - Potential Return: "+53.8%" (if outcome resolves favorably)
  - Estimated Fees: "◎0.00025" (Solana transaction fee)
- **Action Button:**
  - Text: "Place Trade" (or "Buy YES" / "Buy NO")
  - Style: Large, full-width, primary blue (or outcome color)
  - Disabled states:
    - "Connect Wallet" (if not connected)
    - "Insufficient Balance" (if wallet balance too low)
    - "Market Closed" (if past resolution date)
  - Loading state: Spinner + "Confirming..."
- **User's Current Position** (if exists):
  - Small info box above widget
  - "You hold: 5 YES shares (cost: ◎3.25)"

#### Right Column (1/3 width on desktop)

**Price Chart:**
- Component: Recharts LineChart or AreaChart
- Y-axis: Price (0-1 SOL range)
- X-axis: Time
- Two lines: YES price (green), NO price (red)
- Timeframe selector: 1H | 24H | 7D | All
- Tooltip on hover: Shows exact price at timestamp
- **Note:** For MVP, may show simplified data or placeholder if no historical tracking

**Order Book / Recent Trades:**
- **Tabs:** "Recent Trades" | "Order Book" (if applicable)
- **Recent Trades List:**
  - Each row: "0.5 YES @ ◎0.65" | "2m ago"
  - Color-coded: Green for YES, red for NO
  - Shows last 10-20 trades
  - Auto-updates via WebSocket subscription
- **Empty State:** "No recent trades"

**Market Stats Card:**
- Total Volume: "◎1,234.56"
- Total Liquidity: Shows pool sizes
- Participants: Number of unique traders
- Creation Date: "Created 5 days ago"

#### Mobile Layout (Stacked)

- Market Header (full-width)
- Trading Widget (full-width, sticky)
- Description (collapsible)
- Chart (full-width)
- Recent Trades (simplified list)

### C. Portfolio View

**Route:** `/portfolio`

**Requires:** Connected wallet (redirect to markets if not connected)

**Layout:** Single column with sections

**Your Positions:**
- Table/card list of active positions:
  - Market Title | Outcome (YES/NO) | Shares | Cost Basis | Current Value | P&L | Action
- Profit/Loss color-coded (green/red)
- "Sell" or "Close Position" button (if market still open)
- Filter: Active | Resolved
- Sort: P&L, Market Name, Date

**Transaction History:**
- Chronological list of all trades
- Each row: Date | Market | Action (Buy/Sell) | Amount | Price | Tx Signature (link to Solscan)
- Pagination or infinite scroll

**Portfolio Summary:**
- Total Portfolio Value: Sum of all positions
- Total P&L: Lifetime profit/loss
- Win Rate: % of resolved positions that were profitable

**Empty State:**
- "You haven't placed any trades yet"
- "Explore markets" button

### D. Create Market View

**Route:** `/create`

**Requires:** Connected wallet

**Layout:** Centered form card (max-width: `max-w-2xl`)

**Form Fields:**
1. **Market Title** (required)
   - Input: Text field
   - Placeholder: "Will Bitcoin reach $100k by Dec 31, 2025?"
   - Max length: 200 characters
   - Validation: Required, min 10 chars

2. **Category** (required)
   - Select: Dropdown (Sports, Politics, Crypto, Entertainment, Other)

3. **Description** (required)
   - Textarea: Multi-line
   - Placeholder: "Describe the resolution criteria..."
   - Min length: 50 characters
   - Max length: 1000 characters

4. **Resolution Date** (required)
   - Date-time picker
   - Min: Current date + 1 day
   - Max: 1 year from now
   - Displays in user's timezone but stores in UTC

5. **Initial Liquidity** (required)
   - Input: Number field (SOL)
   - Info text: "You'll provide equal liquidity to both YES and NO pools"
   - Min: 0.5 SOL
   - Max: Wallet balance - 0.02 SOL (for fees)
   - Calculation: Shows "You'll add ◎X to YES pool and ◎X to NO pool"

6. **Oracle/Resolver** (optional for MVP)
   - Input: Solana public key
   - Info: "Who can resolve this market? (defaults to market creator)"
   - Default: Creator's wallet address

**Action Buttons:**
- "Create Market" (primary)
- "Cancel" (secondary, navigates back)

**Transaction Flow:**
1. Click "Create Market"
2. Form validation (Zod schema)
3. Show transaction preview modal
4. User approves in wallet
5. Submit transaction to blockchain
6. Toast notification: "Transaction submitted..." (with Solscan link)
7. On confirmation: Toast "Market created!" + redirect to new market detail page

**Estimated Costs:**
- Display: "Estimated cost: ◎X.XX (liquidity) + ◎0.0025 (fees)"

### E. Wallet Connection Components

**Wallet Modal:**
- Triggered by: Clicking "Connect Wallet" button
- Component: Radix Dialog (Shadcn `<Dialog>`)
- **Content:**
  - Title: "Connect Wallet"
  - Description: "Connect your Solana wallet to trade on Devnet"
  - List of wallet options:
    - Phantom (logo + name)
    - Solflare
    - Backpack
    - Brave Wallet
    - (Auto-detected from @solana/wallet-adapter-wallets)
  - Each option: Clickable button with wallet logo and name
  - Footer: "New to Solana? Learn more" link
- **Behavior:**
  - Click wallet → trigger wallet adapter connection
  - On success: Close modal, update header with connected state
  - On error: Show error toast "Failed to connect: [error message]"

**Wallet Dropdown (Connected State):**
- Triggered by: Clicking wallet address in header
- Component: Radix DropdownMenu
- **Items:**
  1. Full wallet address (with copy icon)
  2. SOL balance: "◎ 2.45 SOL"
  3. Divider
  4. "Airdrop 1 SOL" (button, Devnet only)
     - On click: Call `connection.requestAirdrop()` → Toast notification
  5. "View on Solscan" (link, opens in new tab)
  6. Divider
  7. "Disconnect" (button, red text)

### F. Transaction Status & Notifications

**Toast Notifications:**
- Library: Radix Toast (via Shadcn `<Toast>`)
- Position: Bottom-right corner
- Auto-dismiss: 5 seconds (except for pending transactions)

**Transaction States:**

1. **Pending:**
   - Icon: Spinning loader
   - Title: "Transaction Submitted"
   - Description: "Confirming on Solana Devnet..."
   - Action: "View on Solscan" link
   - Duration: Until confirmed (no auto-dismiss)

2. **Success:**
   - Icon: Green check mark (Lucide `CheckCircle`)
   - Title: "Trade Executed Successfully!" (or "Market Created!")
   - Description: "Your transaction has been confirmed"
   - Action: "View Transaction" link to Solscan
   - Duration: 5 seconds

3. **Error:**
   - Icon: Red X (Lucide `XCircle`)
   - Title: "Transaction Failed"
   - Description: Error message from blockchain (e.g., "Insufficient funds" or "Market already resolved")
   - Action: "Retry" button (if applicable) or "Dismiss"
   - Duration: 10 seconds

**Loading States:**
- During transaction: Disable form inputs and show loading spinner on button
- After submission: Keep button disabled until confirmation
- Show progress indicator if multi-step process

## 4. Responsive Design

The application must be fully responsive, adhering to Tailwind's default breakpoints:

| Breakpoint | Width | Layout | Notes |
| :--- | :--- | :--- | :--- |
| **Mobile (default)** | < 640px | Single-column | Top Nav collapses to hamburger menu. Market Listing uses simplified card view. Market Detail is fully stacked. Trading widget is sticky at bottom. |
| **Small (sm)** | ≥ 640px | Single to two-column | Market cards in 2-column grid. |
| **Medium (md)** | ≥ 768px | Two-column (where applicable) | Market Listing can use condensed table view. Portfolio uses table format. |
| **Large (lg)** | ≥ 1024px | Multi-column | Market Detail uses two-column layout. Full data tables with all columns visible. |
| **Extra Large (xl)** | ≥ 1280px | Full-width, multi-column | Maximum content width applied (`max-w-7xl`). Chart and order book side-by-side. |

**Mobile-Specific Considerations:**
- Touch-friendly targets: Min 44px tap area for all buttons
- Larger form inputs on mobile (min `text-base`)
- Bottom-sheet style modals for better thumb reach
- Sticky trading widget on Market Detail for quick access
- Pull-to-refresh for market listings (optional enhancement)

## 5. Solana Integration Patterns

### Wallet Connection Flow

1. **Initial State (Disconnected):**
   - Header shows "Connect Wallet" button
   - Trading widgets show "Connect Wallet to Trade"
   - Portfolio redirects to markets with message "Connect wallet to view portfolio"

2. **Connection Trigger:**
   - User clicks "Connect Wallet"
   - Wallet modal opens with available adapters

3. **Wallet Selection:**
   - User selects wallet (e.g., Phantom)
   - Browser extension prompts for approval
   - If approved: Close modal, update header
   - If rejected: Show error toast

4. **Connected State:**
   - Header shows wallet address snippet and balance
   - Fetch user's SOL balance from blockchain
   - Enable all trading functionality
   - Load user's portfolio data (PDAs)

5. **Auto-Reconnect:**
   - Use wallet adapter's auto-connect feature
   - Attempt to reconnect on page load if previously connected
   - Show reconnecting indicator

### Account Data Fetching Strategy

**Using TanStack Query for Caching:**

```typescript
// Example pattern (conceptual)
const { data: markets, isLoading } = useQuery({
  queryKey: ['markets', 'all'],
  queryFn: () => program.account.market.all(),
  staleTime: 10_000, // 10 seconds
  refetchInterval: 30_000, // Refetch every 30s
});
```

**Fetch Patterns:**
1. **Market List:** Fetch all market accounts on dashboard load
2. **Market Detail:** Fetch single market by PDA
3. **User Positions:** Query PDAs derived from wallet + market accounts
4. **Recent Trades:** Use `onAccountChange` WebSocket subscription

**Real-Time Updates:**
- Subscribe to market account changes when viewing Market Detail
- Update UI automatically when account data changes
- Unsubscribe when component unmounts

### Transaction Execution Pattern

**Standard Flow:**
1. User fills form (e.g., trade amount, outcome)
2. Validate inputs with Zod schema
3. Show transaction preview (optional)
4. Build transaction with Anchor client:
   ```typescript
   const tx = await program.methods
     .placeTrade(amount, outcome)
     .accounts({ market, user, ... })
     .rpc();
   ```
5. Wallet adapter prompts user to sign
6. Submit transaction to RPC
7. Show pending toast with transaction signature
8. Poll for confirmation or use `connection.confirmTransaction()`
9. On confirmation: Show success toast, invalidate queries (refetch data)
10. On error: Show error toast with reason

**Error Handling:**
- Network errors: "Connection failed, please retry"
- Wallet rejection: "Transaction cancelled by user"
- Blockchain errors: Parse and display (e.g., "Insufficient balance")
- Unknown errors: "An unexpected error occurred"

### Form Validation Rules

**Trading Widget:**
- **Amount Input:**
  - Type: Number
  - Min: 0.01 SOL
  - Max: User balance - 0.01 SOL (reserve for fees)
  - Decimals: 2 places max (9 decimal places for lamports, but UI shows 2)
  - Required: Yes
  - Error messages:
    - "Amount must be at least 0.01 SOL"
    - "Amount exceeds your balance"
    - "Amount must be a number"

**Market Creation Form:**
- **Title:**
  - Min: 10 characters
  - Max: 200 characters
  - Required: Yes
  
- **Description:**
  - Min: 50 characters
  - Max: 1000 characters
  - Required: Yes
  
- **Resolution Date:**
  - Min: Current date + 1 day
  - Max: Current date + 365 days
  - Required: Yes
  - Error: "Resolution date must be in the future"
  
- **Initial Liquidity:**
  - Min: 0.5 SOL
  - Max: User balance - 0.02 SOL
  - Required: Yes

## 6. Devnet-Specific UI Elements

### Devnet Mode Indicator

**Location:** Top-right corner of header (always visible)

**Design:**
- Badge component: `bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200`
- Text: "⚠️ DEVNET MODE"
- Border: `border border-yellow-300`
- Font: `text-xs font-semibold uppercase tracking-wide`

**Behavior:**
- Non-dismissible (always visible)
- Tooltip on hover: "This app uses Solana Devnet. No real funds at risk."

### Airdrop Functionality

**Location:** Wallet dropdown menu (only when connected)

**Implementation:**
- Button: "Airdrop 1 SOL"
- Icon: Droplet or parachute icon
- On click:
  1. Call `connection.requestAirdrop(publicKey, 1_000_000_000)` (1 SOL in lamports)
  2. Show pending toast: "Requesting airdrop..."
  3. On success: Toast "1 SOL airdropped!" + update balance display
  4. On error: Toast "Airdrop failed (rate limit or network error)"
- Rate limit handling: Disable button for 60 seconds after successful airdrop

**Visual Cue:**
- If balance < 0.1 SOL, show yellow warning in wallet dropdown: "Low balance. Airdrop SOL for testing."

### Explorer Links

**Transaction Links:**
- Format: `https://solscan.io/tx/{signature}?cluster=devnet`
- Open in new tab (`target="_blank" rel="noopener noreferrer"`)
- Icon: External link icon (Lucide `ExternalLink`)

**Account Links:**
- Wallet address: `https://solscan.io/account/{address}?cluster=devnet`
- Market account: `https://solscan.io/account/{market_pubkey}?cluster=devnet`

## 7. Iconography and Imagery

### Icon Library: Lucide React

**Common Icons:**
- Wallet: `Wallet` icon
- Chart: `TrendingUp`, `LineChart`
- Settings: `Settings`
- Sun/Moon: `Sun`, `Moon` (theme toggle)
- External link: `ExternalLink`
- Copy: `Copy`
- Check: `CheckCircle`, `Check`
- Error: `XCircle`, `AlertTriangle`
- Calendar: `Calendar`
- Filter: `Filter`
- Sort: `ArrowUpDown`
- Menu (hamburger): `Menu`
- Close: `X`

**Usage:**
- Size: `size={20}` for inline icons, `size={24}` for buttons
- Stroke width: `strokeWidth={2}` for consistency
- Color: Inherit from text color or use Tailwind classes

### Imagery

**Minimal Use:**
- No decorative hero images
- No stock photos
- Focus on data visualization (charts, graphs)
- Wallet logos: Use official logos from wallet providers (included in wallet adapter UI)

### Logo

- App logo: Simple wordmark "FoundersNet" with optional Solana symbol
- Monochromatic or use Solana brand colors
- Responsive: Full logo on desktop, icon/initials on mobile

## 8. Accessibility (A11Y)

**Keyboard Navigation:**
- All interactive elements (buttons, links, inputs) must be keyboard accessible
- Logical tab order (top to bottom, left to right)
- Focus indicators: Visible outline on all focusable elements (Tailwind `focus:ring-2`)
- Skip to main content link (for screen readers)

**Screen Readers:**
- All images/icons have `aria-label` or `alt` text
- Form inputs have associated `<label>` elements
- Use semantic HTML (`<button>`, `<nav>`, `<main>`, `<article>`)
- ARIA attributes for modals, dropdowns, tabs (handled by Radix UI)

**Color Contrast:**
- Ensure WCAG AA compliance (4.5:1 for normal text, 3:1 for large text)
- Test with dark mode enabled
- Don't rely solely on color to convey information (use icons + text)

**Form Accessibility:**
- All inputs have labels
- Error messages are announced to screen readers (`aria-describedby`)
- Required fields marked with asterisk and `aria-required="true"`
- Disabled states clearly indicated (visual + `aria-disabled`)

## 9. Performance Considerations

**Bundle Size:**
- Target: < 500KB gzipped initial bundle
- Use Vite code-splitting for routes (React.lazy)
- Tree-shaking for unused Tailwind classes (production build)
- Lazy-load wallet adapters (only load selected wallet)

**Data Fetching:**
- TanStack Query caching reduces redundant RPC calls
- Stale time: 10-30 seconds for market data
- Refetch on window focus for active trading
- Optimistic updates for better perceived performance

**Blockchain Latency:**
- Show loading indicators immediately on user action
- Display estimated confirmation time: "~1 second" for transactions
- Don't block UI during confirmation (use toasts)
- Implement timeout for long-running transactions (e.g., 30 seconds)

**Rendering Performance:**
- Virtualize long lists (market listings, transaction history) if > 50 items
- Debounce search/filter inputs (300ms)
- Memoize expensive calculations (React.memo, useMemo)
- Avoid unnecessary re-renders (proper dependency arrays)

**WebSocket Efficiency:**
- Only subscribe to accounts actively being viewed
- Unsubscribe immediately on component unmount
- Batch multiple subscriptions where possible
- Handle reconnection on WebSocket disconnect

## 10. Data Structures and State Management

### Market Account Data (from Anchor IDL)

**Expected Fields:**
```typescript
interface Market {
  publicKey: PublicKey;       // Market account address (PDA)
  title: string;              // Market question
  description: string;        // Resolution criteria
  category: string;           // Category (Sports, Politics, etc.)
  resolutionDate: BN;         // Unix timestamp (seconds)
  creator: PublicKey;         // Market creator wallet
  resolver: PublicKey;        // Who can resolve (oracle)
  yesPool: BN;                // Liquidity in YES pool (lamports)
  noPool: BN;                 // Liquidity in NO pool (lamports)
  totalVolume: BN;            // Total traded volume (lamports)
  status: { open: {} } | { resolved: {} };  // Enum
  outcome?: { yes: {} } | { no: {} };       // Final outcome (if resolved)
  createdAt: BN;              // Creation timestamp
}
```

### User Position Data (PDA)

```typescript
interface UserPosition {
  publicKey: PublicKey;       // Position PDA
  market: PublicKey;          // Associated market
  user: PublicKey;            // User wallet
  yesShares: BN;              // YES shares owned (lamports)
  noShares: BN;               // NO shares owned (lamports)
  totalCost: BN;              // Total SOL spent (cost basis)
  lastTradeAt: BN;            // Last trade timestamp
}
```

### State Management Strategy

**Global State (React Context):**
- Wallet connection state (via `@solana/wallet-adapter-react`)
- Anchor program instance
- RPC connection
- Theme preference (light/dark)

**Server State (TanStack Query):**
- Market data (all markets, individual markets)
- User positions
- Transaction history
- Account balances

**Local State (useState):**
- Form inputs (trade amount, market creation fields)
- UI state (modals open/closed, dropdowns, filters)
- Temporary calculations (potential returns, validation errors)

## 11. Error Boundaries and Fallbacks

**Component Error Boundaries:**
- Wrap major sections in ErrorBoundary components
- Show fallback UI: "Something went wrong. Reload page"
- Log errors to console (or external service in production)

**Network Error Handling:**
- RPC errors: "Failed to fetch data from Solana network"
- Timeout errors: "Request timed out. Please try again"
- Retry mechanism: Allow user to manually retry failed requests

**Empty States:**
- No markets: "No markets found. Create the first one!"
- No positions: "You haven't placed any trades yet"
- No transaction history: "Your trades will appear here"

## 12. Animation and Micro-interactions

**Subtle Animations (Tailwind):**
- Button hover: `hover:scale-105 transition-transform`
- Card hover: `hover:shadow-lg transition-shadow`
- Loading spinners: Use Lucide `Loader2` with `animate-spin`
- Toast entrance: Slide in from bottom-right
- Modal entrance: Fade in backdrop, scale up content

**Avoid:**
- Excessive animations that distract from data
- Auto-playing animations that can't be paused
- Animations longer than 300ms

**Focus on:**
- Smooth transitions between states
- Immediate feedback on user actions (button click states)
- Progressive loading (skeleton screens, not blank pages)

## 13. Dark Mode Support

**Implementation:**
- Use Tailwind's `dark:` variant throughout
- Theme toggle in header (stores preference in localStorage)
- Default: System preference (`prefers-color-scheme`)

**Color Adjustments:**
- Background: `bg-white dark:bg-slate-900`
- Cards: `bg-gray-50 dark:bg-slate-800`
- Text: `text-gray-900 dark:text-gray-100`
- Borders: `border-gray-200 dark:border-gray-700`

**Testing:**
- Test all components in both light and dark modes
- Ensure color contrast remains accessible in both modes

## 14. Copy and Microcopy

**Tone:** Professional, clear, and concise. Avoid jargon where possible.

**Button Labels:**
- Action-oriented: "Place Trade", "Create Market", "Connect Wallet"
- Avoid: "Submit", "OK", "Confirm" (too generic)

**Error Messages:**
- Specific and actionable: "Amount must be at least 0.01 SOL"
- Not: "Invalid input" (too vague)

**Empty States:**
- Encouraging: "No markets yet. Be the first to create one!"
- Not: "No data" (unhelpful)

**Confirmation Messages:**
- Clear and reassuring: "Market created successfully!"
- Include next steps: "Your transaction is being confirmed..."

**Help Text:**
- Contextual: "Initial liquidity will be split equally between YES and NO pools"
- Not: Long paragraphs of explanation (use tooltips for details)

## 15. User Flows (Critical Paths)

### Flow 1: First-Time User Trading

1. User lands on dashboard (Markets view)
2. Sees Devnet indicator and "Connect Wallet" button
3. Clicks "Connect Wallet" → Modal opens
4. Selects wallet (e.g., Phantom) → Browser extension prompts
5. Approves connection → Modal closes, header updates
6. (If balance is low) Sees "Low balance" warning in wallet dropdown
7. Clicks "Airdrop 1 SOL" → Gets test SOL
8. Browses markets, clicks on interesting market
9. Views market detail, reads description
10. Enters trade amount in trading widget
11. Selects outcome (YES or NO)
12. Reviews trade summary (shares, potential return)
13. Clicks "Place Trade" → Wallet prompts for signature
14. Approves → Pending toast appears
15. Transaction confirms → Success toast + position appears
16. Can view position in Portfolio

**Expected Time:** 2-3 minutes for experienced crypto users

### Flow 2: Creating a Market

1. User (already connected) navigates to "Create" tab
2. Sees market creation form
3. Fills in title, category, description
4. Selects resolution date (date picker)
5. Enters initial liquidity amount
6. Reviews estimated costs
7. Clicks "Create Market"
8. Wallet prompts for signature (for liquidity + fees)
9. Approves → Pending toast
10. Transaction confirms → Success toast
11. Redirects to new market detail page
12. Market appears in listings for others to trade

**Expected Time:** 3-5 minutes

### Flow 3: Checking Portfolio

1. User clicks "Portfolio" tab
2. Views list of active positions
3. Sees P&L for each position (color-coded)
4. Clicks on a position → Navigates to that market
5. Can view market status and close position if desired
6. Scrolls down to transaction history
7. Clicks transaction signature → Opens Solscan in new tab

**Expected Time:** 1-2 minutes

## 16. Component Hierarchy and Relationships

### Component Tree (Conceptual)

```
App
├── WalletProvider (from @solana/wallet-adapter-react)
├── QueryClientProvider (TanStack Query)
├── ThemeProvider (Dark mode context)
└── Router
    ├── Layout
    │   ├── Header
    │   │   ├── Logo
    │   │   ├── Navigation
    │   │   ├── DevnetBadge
    │   │   ├── ThemeToggle
    │   │   └── WalletButton
    │   │       └── WalletModal (Radix Dialog)
    │   │           └── WalletList
    │   ├── Main (Outlet for routes)
    │   └── Footer
    │
    ├── Routes
    │   ├── /markets (MarketListView)
    │   │   ├── FilterBar
    │   │   └── MarketGrid/Table
    │   │       └── MarketCard (repeating)
    │   │
    │   ├── /market/:id (MarketDetailView)
    │   │   ├── MarketHeader
    │   │   ├── MarketDescription
    │   │   ├── TradingWidget
    │   │   │   ├── OutcomeSelector
    │   │   │   ├── AmountInput
    │   │   │   ├── TradeSummary
    │   │   │   └── PlaceTradeButton
    │   │   ├── PriceChart (Recharts)
    │   │   ├── RecentTradesList
    │   │   └── MarketStats
    │   │
    │   ├── /portfolio (PortfolioView)
    │   │   ├── PositionsList
    │   │   │   └── PositionCard (repeating)
    │   │   ├── PortfolioSummary
    │   │   └── TransactionHistory
    │   │       └── TransactionRow (repeating)
    │   │
    │   └── /create (CreateMarketView)
    │       └── MarketCreationForm
    │           ├── TitleInput
    │           ├── CategorySelect
    │           ├── DescriptionTextarea
    │           ├── ResolutionDatePicker
    │           ├── LiquidityInput
    │           └── CreateButton
    │
    └── ToastProvider (Radix Toast)
        └── Toast (for notifications)
```

### Reusable Components

**UI Components (from Shadcn):**
- `<Button>` - All buttons with variants (primary, secondary, ghost)
- `<Card>` - Container for market cards, widgets, stats
- `<Input>` - Text and number inputs
- `<Label>` - Form labels
- `<Select>` - Dropdowns for filters and categories
- `<Dialog>` - Wallet modal, transaction confirmations
- `<DropdownMenu>` - Wallet dropdown, action menus
- `<Toast>` - Notifications
- `<Tabs>` - Recent trades vs order book
- `<Badge>` - Category badges, status indicators
- `<Separator>` - Visual dividers

**Custom Components:**
- `<MarketCard>` - Reusable market display (used in listings)
- `<PriceDisplay>` - Formatted price with SOL symbol
- `<WalletBalance>` - Shows user balance
- `<TransactionLink>` - Link to Solscan with external icon
- `<LoadingSkeleton>` - Loading placeholder
- `<EmptyState>` - No data messaging

## 17. Testing and Quality Assurance

### Manual Testing Checklist

**Wallet Integration:**
- [ ] Connect with Phantom wallet
- [ ] Connect with Solflare wallet
- [ ] Disconnect wallet
- [ ] Auto-reconnect on page refresh
- [ ] Handle wallet rejection gracefully
- [ ] Display correct balance
- [ ] Airdrop functionality works

**Trading Functionality:**
- [ ] Can place YES trade
- [ ] Can place NO trade
- [ ] Form validation works correctly
- [ ] Insufficient balance error shows
- [ ] Transaction pending state displays
- [ ] Success confirmation appears
- [ ] Position updates in portfolio
- [ ] Can't trade after market resolves

**Market Creation:**
- [ ] All form validations work
- [ ] Date picker enforces future dates
- [ ] Liquidity calculation is correct
- [ ] Market appears in listings after creation
- [ ] Creator can view their created market

**Responsive Design:**
- [ ] Mobile layout (< 640px) works
- [ ] Tablet layout (768px) works
- [ ] Desktop layout (1024px+) works
- [ ] Navigation collapses on mobile
- [ ] Trading widget is usable on small screens

**Accessibility:**
- [ ] Keyboard navigation works throughout
- [ ] Focus indicators are visible
- [ ] Screen reader announces important changes
- [ ] Color contrast passes WCAG AA
- [ ] All images have alt text

**Dark Mode:**
- [ ] Toggle switches theme correctly
- [ ] Theme persists on refresh
- [ ] All components visible in dark mode
- [ ] Charts readable in dark mode

### Browser Testing

Test on:
- Chrome/Chromium (latest)
- Firefox (latest)
- Safari (latest, macOS only)
- Brave (latest)

### Device Testing

- Desktop (1920x1080)
- Laptop (1366x768)
- Tablet (768x1024)
- Mobile (375x667 iPhone SE)
- Mobile (390x844 iPhone 14)

## 18. Implementation Priority (Phased Approach)

### Phase 1: MVP Core (Week 1-2)

**Must Have:**
- ✅ Basic layout (header, main, footer)
- ✅ Wallet connection (Phantom only initially)
- ✅ Market listing view (read-only)
- ✅ Market detail view (read-only)
- ✅ Simple trading widget (functional)
- ✅ Transaction notifications (toast)
- ✅ Devnet indicator

**Goal:** Users can connect wallet, view markets, and place trades

### Phase 2: Enhanced UX (Week 3)

**Should Have:**
- ✅ Portfolio view (positions and history)
- ✅ Market creation form
- ✅ Filtering and sorting markets
- ✅ Price chart (basic)
- ✅ Recent trades list
- ✅ Responsive design (mobile optimization)
- ✅ Multi-wallet support (Solflare, Backpack)

**Goal:** Full feature set for end-users

### Phase 3: Polish (Week 4)

**Nice to Have:**
- ✅ Dark mode support
- ✅ Loading skeletons
- ✅ Empty states
- ✅ Advanced chart features (timeframes)
- ✅ Transaction history with Solscan links
- ✅ Improved animations and transitions
- ✅ Comprehensive error handling

**Goal:** Production-ready polish and user delight

### Phase 4: Future Enhancements (Post-MVP)

**Deferred:**
- Order book visualization
- Market search functionality
- User profiles and reputation
- Social features (comments, sharing)
- Email notifications
- Mobile app (React Native)
- Advanced analytics dashboard

## 19. Design System Documentation

### Spacing Scale (Tailwind)

Use Tailwind's default spacing scale:
- `space-0`: 0px
- `space-1`: 0.25rem (4px)
- `space-2`: 0.5rem (8px)
- `space-4`: 1rem (16px) - Most common
- `space-6`: 1.5rem (24px)
- `space-8`: 2rem (32px)
- `space-12`: 3rem (48px)

**Consistency Guidelines:**
- Component padding: `p-4` or `p-6`
- Section spacing: `space-y-8` or `space-y-12`
- Form field spacing: `space-y-4`
- Card margin: `gap-4` in grid layouts

### Border Radius

- Small: `rounded` (0.25rem) - Badges, small buttons
- Medium: `rounded-md` (0.375rem) - Inputs, cards
- Large: `rounded-lg` (0.5rem) - Modals, large cards
- Full: `rounded-full` - Icons, avatars

### Shadow Scale

- Small: `shadow-sm` - Subtle elevation (cards at rest)
- Medium: `shadow-md` - Moderate elevation (dropdowns)
- Large: `shadow-lg` - Strong elevation (modals, hover states)
- XL: `shadow-xl` - Maximum elevation (dialogs)

## 20. Accessibility Reference

### ARIA Labels Required

**Buttons:**
```jsx
<button aria-label="Connect wallet">
  <WalletIcon />
</button>
```

**Form Inputs:**
```jsx
<input 
  id="trade-amount" 
  aria-describedby="amount-error"
  aria-invalid={hasError}
/>
```

**Loading States:**
```jsx
<div role="status" aria-live="polite">
  Loading markets...
</div>
```

**Modals:**
```jsx
<Dialog 
  aria-labelledby="modal-title"
  aria-describedby="modal-description"
>
```

### Focus Management

- First focusable element in modals receives focus on open
- Focus returns to trigger element on modal close
- Tab traps within modals (no tabbing to background)
- Skip links for keyboard users: "Skip to main content"

## 21. Performance Budgets

### Target Metrics

- **First Contentful Paint (FCP):** < 1.5s
- **Largest Contentful Paint (LCP):** < 2.5s
- **Time to Interactive (TTI):** < 3.5s
- **Cumulative Layout Shift (CLS):** < 0.1
- **First Input Delay (FID):** < 100ms

### Bundle Size Limits

- Initial JS bundle: < 200KB (gzipped)
- CSS bundle: < 20KB (gzipped)
- Total page weight: < 500KB (gzipped)

### Image Optimization

- Use WebP format where supported
- Lazy load images below the fold
- Provide appropriate sizes for responsive images
- Wallet logos: < 10KB each

## 22. Browser Storage Usage

**Do NOT Use:**
- ❌ localStorage (not supported in Claude artifacts)
- ❌ sessionStorage (not supported)
- ❌ IndexedDB

**Use Instead:**
- ✅ React state (useState, useReducer) for all data
- ✅ TanStack Query for server state caching (in-memory)
- ✅ Context API for global state
- ✅ URL parameters for shareable state (market IDs)

**Exception:** Theme preference can use localStorage if deploying outside artifacts, otherwise default to system preference only.

## 23. Final Notes for AI Agent

### Critical Implementation Details

1. **All components use Shadcn UI** - Never write custom Radix primitives from scratch
2. **Only core Tailwind classes** - No custom CSS, no Tailwind compiler features
3. **No browser storage APIs** - All state must be in-memory (React state or TanStack Query)
4. **Devnet only** - Hardcode RPC endpoint to Devnet, always show Devnet indicator
5. **Type safety** - Import Anchor IDL types, use TypeScript strictly
6. **Error boundaries** - Wrap major sections to prevent full app crashes

### When In Doubt

- **Styling:** Check Shadcn UI examples first
- **State management:** Use TanStack Query for blockchain data, useState for UI state
- **Wallet integration:** Follow @solana/wallet-adapter-react patterns
- **Transactions:** Use Anchor client methods, not raw web3.js transactions
- **Validation:** Use Zod schemas for all user inputs

### Quality Checklist Before Completion

- [ ] All components are fully typed (no `any` types)
- [ ] Error states are handled gracefully
- [ ] Loading states use skeletons (not spinners everywhere)
- [ ] All forms have validation
- [ ] All buttons have clear labels
- [ ] Mobile responsive at all breakpoints
- [ ] Dark mode works throughout
- [ ] Wallet connection is stable
- [ ] Transactions show proper feedback
- [ ] No console errors in browser

---

**This design document is comprehensive and ready for AI agent implementation. All decisions are specified, ambiguities resolved, and technical constraints clearly defined.**
