#!/usr/bin/env bash
set -euo pipefail
docker compose up -d db
docker compose run --rm -e DATABASE_URL=sqlite:////tmp/mpm-test.db backend python -m pytest -q
docker compose run --rm frontend npm test -- --run
