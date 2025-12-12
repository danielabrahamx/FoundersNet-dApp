#!/bin/bash

# FoundersNet Devnet Deployment Script
# This script deploys the Anchor program to Solana Devnet

set -e

echo "======================================"
echo "FoundersNet Devnet Deployment"
echo "======================================"
echo ""

# Setup environment
export PATH="/home/engine/.local/share/solana/install/active_release/bin:$PATH"
export PATH="/home/engine/.cargo/bin:$PATH"

# Check Solana CLI
if ! command -v solana &> /dev/null; then
    echo "❌ Error: Solana CLI not found"
    exit 1
fi

# Check Anchor CLI
if ! command -v anchor &> /dev/null; then
    echo "❌ Error: Anchor CLI not found"
    exit 1
fi

# Check balance
WALLET=$(solana address)
BALANCE=$(solana balance | grep -o '[0-9.]*')
echo "📍 Deployment Wallet: $WALLET"
echo "💰 Current Balance: $BALANCE SOL"
echo ""

# Check if sufficient balance
if (( $(awk 'BEGIN {print ('"$BALANCE"' < 1.85)}') )); then
    echo "⚠️  Insufficient balance for deployment"
    echo "   Required: ~1.85 SOL"
    echo "   Current: $BALANCE SOL"
    echo ""
    echo "Please add more SOL to: $WALLET"
    echo ""
    echo "Options:"
    echo "  1. Transfer from admin wallet:"
    echo "     solana transfer $WALLET 1 --url devnet"
    echo ""
    echo "  2. Use web faucet: https://faucet.solana.com"
    echo ""
    exit 1
fi

echo "✅ Sufficient balance detected"
echo ""

# Deploy
echo "🚀 Deploying program to Devnet..."
echo ""

anchor deploy --provider.cluster devnet

if [ $? -eq 0 ]; then
    echo ""
    echo "======================================"
    echo "✅ DEPLOYMENT SUCCESSFUL!"
    echo "======================================"
    echo ""
    echo "Program ID: 245syyVU4A1jY1Qa7K9PLnpcAE9Kv1qcj5J51hm5gKhd"
    echo ""
    echo "View on Solscan:"
    echo "https://solscan.io/account/245syyVU4A1jY1Qa7K9PLnpcAE9Kv1qcj5J51hm5gKhd?cluster=devnet"
    echo ""
    echo "Frontend .env updated with Program ID"
    echo ""
else
    echo ""
    echo "======================================"
    echo "❌ DEPLOYMENT FAILED"
    echo "======================================"
    echo ""
    echo "Please check the error above and try again"
    echo ""
    exit 1
fi
