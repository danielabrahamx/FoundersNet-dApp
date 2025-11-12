#!/bin/bash
export PATH="$HOME/.local/share/solana/install/active_release/bin:$HOME/.cargo/bin:$PATH"
cd /mnt/c/Users/danie/FoundersNet-Sol-1
echo "Building program..."
~/.cargo/bin/anchor build
echo ""
echo "Build complete. Now deploying..."
~/.cargo/bin/anchor deploy --provider.cluster devnet
