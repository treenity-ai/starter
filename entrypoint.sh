#!/bin/bash
set -e

# Create tenant mods dir if missing
mkdir -p /app/data/mods

# Install tenant mod deps if they have package.json
if [ -f /app/data/mods/package.json ]; then
  echo "[entrypoint] Installing tenant mod dependencies"
  cd /app/data/mods && npm install --omit=dev 2>&1 | tail -3
  cd /app
fi

exec tsx --conditions development node_modules/@treenity/core/src/server/main.ts root.json
