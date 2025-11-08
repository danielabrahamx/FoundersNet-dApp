// Market types
export interface Market {
  publicKey: string
  account: {
    title: string
    description: string
    category: MarketCategory
    resolutionDate: number
    yesPool: number
    noPool: number
    totalVolume: number
    creator: string
    resolved: boolean
    outcome?: MarketOutcome
  }
}

export enum MarketCategory {
  SPORTS = 'Sports',
  POLITICS = 'Politics',
  CRYPTO = 'Crypto',
  ENTERTAINMENT = 'Entertainment',
  OTHER = 'Other'
}

export enum MarketOutcome {
  YES = 'YES',
  NO = 'NO',
  INVALID = 'INVALID'
}

// User position types
export interface UserPosition {
  marketPublicKey: string
  market: Market
  outcome: MarketOutcome
  shares: number
  costBasis: number
}

// Transaction types
export interface Transaction {
  signature: string
  type: TransactionType
  marketPublicKey: string
  marketTitle: string
  amount: number
  price: number
  outcome?: MarketOutcome
  timestamp: number
  status: TransactionStatus
}

export enum TransactionType {
  CREATE_MARKET = 'CREATE_MARKET',
  PLACE_TRADE = 'PLACE_TRADE',
  RESOLVE_MARKET = 'RESOLVE_MARKET',
  CLAIM_WINNINGS = 'CLAIM_WINNINGS'
}

export enum TransactionStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  FAILED = 'FAILED'
}

// Wallet types
export interface WalletInfo {
  publicKey: string
  balance: number
  connected: boolean
}

// Form types
export interface CreateMarketForm {
  title: string
  description: string
  category: MarketCategory
  resolutionDate: Date
  initialLiquidity: number
}

export interface TradeForm {
  amount: number
  outcome: MarketOutcome
}