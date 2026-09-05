#!/usr/bin/env bash
set -euo pipefail
docker compose config --quiet
docker compose run --rm backend ruff check app tests
docker compose run --rm backend mypy app --ignore-missing-imports
docker compose run --rm frontend npm run lint
docker compose run --rm frontend npm run build
