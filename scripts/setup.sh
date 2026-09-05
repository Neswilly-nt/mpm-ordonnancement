#!/usr/bin/env bash
set -euo pipefail
mkdir -p backend/app/{api,core,models,schemas,services} backend/tests frontend/src/{components,context,pages,services,types,utils}
test -f backend/app/main.py
test -f frontend/src/App.tsx
if [[ ! -f .env ]]; then cp .env.example .env; fi
docker compose config --quiet
echo "Architecture et configuration vérifiées. Lancez ./install.sh puis ./test.sh."
