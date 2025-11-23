#!/bin/bash

# Quick script to run the complete live demo
# Assumes setup-demo.sh has already been run

echo "🎬 Starting VPoR Live Demo"
echo "=========================="
echo ""

# Get contract address from frontend env
ADDRESS=$(grep NEXT_PUBLIC_GLASS_VAULT_ADDRESS frontend/.env.local | cut -d'=' -f2)

if [ -z "$ADDRESS" ]; then
    echo "❌ No contract address found. Please run ./setup-demo.sh first"
    exit 1
fi

echo "Contract: $ADDRESS"
echo ""
echo "Starting Chainlink asset simulator..."
echo "This will update assets every 10 seconds to simulate live solvency monitoring."
echo ""
echo "Open http://localhost:3000 to watch the changes!"
echo ""

cd backend
GLASS_VAULT_ADDRESS=$ADDRESS npm run simulate
