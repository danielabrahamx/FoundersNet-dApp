/**
 * FoundersNet IDL - Type definitions for the Anchor program
 * This IDL will be updated with the actual deployed program's IDL
 */

// Simple IDL type for Anchor
export const IDL = {
  version: '0.1.0',
  name: 'foundersnet',
  instructions: [
    {
      name: 'createMarket',
      accounts: [],
      args: [],
    },
    {
      name: 'placeBet',
      accounts: [],
      args: [],
    },
    {
      name: 'resolveMarket',
      accounts: [],
      args: [],
    },
  ],
  accounts: [
    {
      name: 'market',
      type: {
        kind: 'struct',
        fields: [
          { name: 'title', type: 'string' },
          { name: 'description', type: 'string' },
          { name: 'eventType', type: 'u8' },
          { name: 'startupName', type: 'string' },
          { name: 'resolutionDate', type: 'i64' },
          { name: 'creator', type: 'publicKey' },
          { name: 'resolver', type: 'publicKey' },
          { name: 'yesPool', type: 'u64' },
          { name: 'noPool', type: 'u64' },
          { name: 'totalVolume', type: 'u64' },
          { name: 'status', type: 'u8' },
          { name: 'outcome', type: { option: 'u8' } },
          { name: 'createdAt', type: 'i64' },
        ],
      },
    },
    {
      name: 'userPosition',
      type: {
        kind: 'struct',
        fields: [
          { name: 'user', type: 'publicKey' },
          { name: 'market', type: 'publicKey' },
          { name: 'yesShares', type: 'u64' },
          { name: 'noShares', type: 'u64' },
          { name: 'totalCost', type: 'u64' },
          { name: 'lastTradeAt', type: 'i64' },
        ],
      },
    },
  ],
};
