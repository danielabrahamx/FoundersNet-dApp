import { Connection } from '@solana/web3.js'

const rpcEndpoint = import.meta.env.VITE_SOLANA_RPC_ENDPOINT || 'https://api.devnet.solana.com'

export const connection = new Connection(rpcEndpoint, 'confirmed')

export const NETWORK = 'devnet'
