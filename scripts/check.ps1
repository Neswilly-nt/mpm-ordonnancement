$ErrorActionPreference = "Stop"
Set-Location (Join-Path $PSScriptRoot "..")
docker compose config --quiet
if ($LASTEXITCODE -ne 0) { throw "Configuration Docker invalide." }
docker compose run --rm backend ruff check app tests
if ($LASTEXITCODE -ne 0) { throw "Controle Python en echec." }
docker compose run --rm frontend npm run lint
if ($LASTEXITCODE -ne 0) { throw "Lint frontend en echec." }
docker compose run --rm frontend npm run build
if ($LASTEXITCODE -ne 0) { throw "Build frontend en echec." }
