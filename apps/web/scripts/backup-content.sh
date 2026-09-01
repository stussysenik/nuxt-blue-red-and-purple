#!/bin/bash
# Export Sanity content to git-tracked backup
# Run: pnpm run sanity:backup
# Outputs NDJSON files to server/backups/

set -e

PROJECT_ID="${NUXT_SANITY_PROJECT_ID}"
DATASET="${NUXT_SANITY_DATASET:-production}"
BACKUP_DIR="$(dirname "$0")/../server/backups"

if [ -z "$PROJECT_ID" ]; then
  echo "Error: NUXT_SANITY_PROJECT_ID not set"
  exit 1
fi

mkdir -p "$BACKUP_DIR"

echo "Exporting dataset '$DATASET' from project '$PROJECT_ID'..."

npx sanity@latest dataset export "$DATASET" "$BACKUP_DIR.tar.gz" \
  --project "$PROJECT_ID" \
  --overwrite

echo "Backup saved to $BACKUP_DIR.tar.gz"
echo "To extract: tar -xzf $BACKUP_DIR.tar.gz -C $BACKUP_DIR/"
