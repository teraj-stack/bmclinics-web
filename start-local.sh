#!/usr/bin/env zsh
export PATH="/Users/krzysztofjarzyna/.gemini/antigravity/scratch/.node/bin:$PATH"
export NEXT_TELEMETRY_DISABLED=1
cd "/Users/krzysztofjarzyna/.gemini/antigravity/scratch/bmclinics"
exec npx next dev --turbopack -p "${PORT:-3000}"
