#!/bin/bash
SOLANA_BIN="$HOME/.local/share/solana/install/active_release/bin"

echo "Generating keypair..."
$SOLANA_BIN/solana-keygen new -o ~/.config/solana/id.json --no-passphrase --force

echo ""
echo "Checking devnet configuration..."
$SOLANA_BIN/solana config get

echo ""
echo "Getting current balance..."
$SOLANA_BIN/solana balance

echo ""
echo "Getting airdrop..."
$SOLANA_BIN/solana airdrop 2

echo ""
echo "Deploying program to devnet..."
cd /mnt/c/Users/danie/FoundersNet-Sol-1
$SOLANA_BIN/solana program deploy target/deploy/foundersnet.so

echo ""
echo "Deployment complete!"
$SOLANA_BIN/solana address
