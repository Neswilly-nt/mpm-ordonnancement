$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot
docker compose up -d --build
if ($LASTEXITCODE -ne 0) { throw "Deploiement Docker en echec." }
docker compose ps
