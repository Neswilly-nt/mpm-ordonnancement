$ErrorActionPreference = "Stop"
Set-Location (Join-Path $PSScriptRoot "..")
docker compose up -d db
if ($LASTEXITCODE -ne 0) { throw "PostgreSQL n'a pas demarre." }
docker compose run --rm -e DATABASE_URL=sqlite:////tmp/mpm-test.db backend python -m pytest -q
if ($LASTEXITCODE -ne 0) { throw "Tests backend en echec." }
docker compose run --rm frontend npm test -- --run
if ($LASTEXITCODE -ne 0) { throw "Tests frontend en echec." }
