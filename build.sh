#!/bin/bash
export PATH="$HOME/.local/share/solana/install/active_release/bin:$HOME/.cargo/bin:$PATH"
cd /mnt/c/Users/danie/FoundersNet-Sol-1
anchor build --no-run 2>&1 | grep -E "(error|Compiling|Finished|ready)" | tail -20
