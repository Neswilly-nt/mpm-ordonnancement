#!/usr/bin/env bash
set -euo pipefail
ROOT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
cd "$ROOT_DIR"
docker compose config --quiet
docker compose run --rm backend ruff check app tests
docker compose run --rm backend mypy app --ignore-missing-imports
docker compose run --rm frontend npm run lint
docker compose run --rm frontend npm run build
