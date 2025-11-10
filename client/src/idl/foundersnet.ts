/**
 * FoundersNet IDL - Type definitions for the Anchor program
 * Generated from the Anchor program
 */

export const IDL = {
  version: "0.1.0",
  name: "foundersnet",
  instructions: [
    {
      name: "createMarket",
      accounts: [
        {
          name: "market",
          isMut: true,
          isSigner: true,
        },
        {
          name: "creator",
          isMut: true,
          isSigner: true,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "title",
          type: "string",
        },
        {
          name: "description",
          type: "string",
        },
        {
          name: "eventType",
          type: "u8",
        },
        {
          name: "startupName",
          type: "string",
        },
        {
          name: "resolutionDate",
          type: "i64",
        },
        {
          name: "initialLiquidity",
          type: "u64",
        },
      ],
    },
    {
      name: "placeBet",
      accounts: [
        {
          name: "market",
          isMut: true,
          isSigner: false,
        },
        {
          name: "userPosition",
          isMut: true,
          isSigner: false,
        },
        {
          name: "user",
          isMut: true,
          isSigner: true,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "amount",
          type: "u64",
        },
        {
          name: "outcome",
          type: {
            defined: "BetOutcome",
          },
        },
      ],
    },
    {
      name: "resolveMarket",
      accounts: [
        {
          name: "market",
          isMut: true,
          isSigner: false,
        },
        {
          name: "resolver",
          isMut: false,
          isSigner: true,
        },
      ],
      args: [
        {
          name: "outcome",
          type: {
            defined: "MarketOutcome",
          },
        },
      ],
    },
    {
      name: "claimWinnings",
      accounts: [
        {
          name: "market",
          isMut: true,
          isSigner: false,
        },
        {
          name: "userPosition",
          isMut: true,
          isSigner: false,
        },
        {
          name: "user",
          isMut: true,
          isSigner: true,
        },
      ],
      args: [],
    },
  ],
  accounts: [
    {
      name: "market",
      type: {
        kind: "struct",
        fields: [
          {
            name: "title",
            type: "string",
          },
          {
            name: "description",
            type: "string",
          },
          {
            name: "category",
            type: "u8",
          },
          {
            name: "eventType",
            type: "u8",
          },
          {
            name: "startupName",
            type: "string",
          },
          {
            name: "resolutionDate",
            type: "i64",
          },
          {
            name: "creator",
            type: "publicKey",
          },
          {
            name: "resolver",
            type: "publicKey",
          },
          {
            name: "yesPool",
            type: "u64",
          },
          {
            name: "noPool",
            type: "u64",
          },
          {
            name: "totalVolume",
            type: "u64",
          },
          {
            name: "status",
            type: "u8",
          },
          {
            name: "outcome",
            type: {
              option: "u8",
            },
          },
          {
            name: "createdAt",
            type: "i64",
          },
          {
            name: "claimedForResolution",
            type: "bool",
          },
        ],
      },
    },
    {
      name: "userPosition",
      type: {
        kind: "struct",
        fields: [
          {
            name: "user",
            type: "publicKey",
          },
          {
            name: "market",
            type: "publicKey",
          },
          {
            name: "yesShares",
            type: "u64",
          },
          {
            name: "noShares",
            type: "u64",
          },
          {
            name: "totalCost",
            type: "u64",
          },
          {
            name: "lastTradeAt",
            type: "i64",
          },
          {
            name: "claimed",
            type: "bool",
          },
        ],
      },
    },
  ],
  types: [
    {
      name: "BetOutcome",
      type: {
        kind: "enum",
        variants: [
          {
            name: "Yes",
          },
          {
            name: "No",
          },
        ],
      },
    },
    {
      name: "MarketOutcome",
      type: {
        kind: "enum",
        variants: [
          {
            name: "Yes",
          },
          {
            name: "No",
          },
          {
            name: "Invalid",
          },
        ],
      },
    },
  ],
  events: [
    {
      name: "MarketCreated",
      fields: [
        {
          name: "market",
          type: "publicKey",
          index: false,
        },
        {
          name: "creator",
          type: "publicKey",
          index: false,
        },
        {
          name: "title",
          type: "string",
          index: false,
        },
      ],
    },
    {
      name: "BetPlaced",
      fields: [
        {
          name: "market",
          type: "publicKey",
          index: false,
        },
        {
          name: "user",
          type: "publicKey",
          index: false,
        },
        {
          name: "amount",
          type: "u64",
          index: false,
        },
        {
          name: "outcome",
          type: "u8",
          index: false,
        },
      ],
    },
    {
      name: "MarketResolved",
      fields: [
        {
          name: "market",
          type: "publicKey",
          index: false,
        },
        {
          name: "resolver",
          type: "publicKey",
          index: false,
        },
        {
          name: "outcome",
          type: "u8",
          index: false,
        },
      ],
    },
    {
      name: "WinningsClaimed",
      fields: [
        {
          name: "market",
          type: "publicKey",
          index: false,
        },
        {
          name: "user",
          type: "publicKey",
          index: false,
        },
        {
          name: "payout",
          type: "u64",
          index: false,
        },
      ],
    },
  ],
  errors: [
    {
      code: 6000,
      name: "InvalidTitleLength",
      msg: "Invalid title length",
    },
    {
      code: 6001,
      name: "InvalidDescriptionLength",
      msg: "Invalid description length",
    },
    {
      code: 6002,
      name: "InsufficientInitialLiquidity",
      msg: "Insufficient initial liquidity",
    },
    {
      code: 6003,
      name: "ResolutionDateInPast",
      msg: "Resolution date is in the past",
    },
    {
      code: 6004,
      name: "BelowMinimumBetAmount",
      msg: "Bet amount is below minimum",
    },
    {
      code: 6005,
      name: "MarketNotOpen",
      msg: "Market is not open",
    },
    {
      code: 6006,
      name: "ResolutionDatePassed",
      msg: "Resolution date has passed",
    },
    {
      code: 6007,
      name: "AlreadyBetOnEvent",
      msg: "User has already bet on this event",
    },
    {
      code: 6008,
      name: "MarketAlreadyResolved",
      msg: "Market is already resolved",
    },
    {
      code: 6009,
      name: "UnauthorizedResolver",
      msg: "Unauthorized resolver",
    },
    {
      code: 6010,
      name: "MarketNotResolved",
      msg: "Market is not resolved",
    },
    {
      code: 6011,
      name: "AlreadyClaimed",
      msg: "Winnings already claimed",
    },
    {
      code: 6012,
      name: "NoWinnings",
      msg: "No winnings available",
    },
    {
      code: 6013,
      name: "ArithmeticOverflow",
      msg: "Arithmetic overflow",
    },
  ],
};
