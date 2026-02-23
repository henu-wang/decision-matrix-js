#!/bin/bash
# One-click publish script for decision-matrix-js
# Prerequisites: npm login (run `npm adduser` first)

set -e

echo "=== Publishing decision-matrix-js to npm ==="

# Check login
echo "Checking npm login status..."
if ! npm whoami 2>/dev/null; then
    echo "ERROR: Not logged in to npm. Run 'npm adduser' first."
    exit 1
fi

echo "Logged in as: $(npm whoami)"

# Run tests
echo "Running tests..."
npm test

# Publish
echo "Publishing..."
npm publish --access public

echo "Done! Package published to https://www.npmjs.com/package/decision-matrix-js"
