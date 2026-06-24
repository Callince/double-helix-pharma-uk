#!/usr/bin/env bash
# Redeploy on the Hetzner box. Run from the project root: bash deploy/deploy.sh
# Builds on the box (ARM64) so native binaries match — never copy node_modules from x64.
set -euo pipefail
cd "$(dirname "$0")/.."
git pull
npm ci
npm run build
sudo systemctl restart doublehelix
echo "deployed $(git rev-parse --short HEAD)"
