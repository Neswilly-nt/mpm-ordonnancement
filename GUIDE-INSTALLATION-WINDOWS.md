# Mise à jour vers MPM Pilot V2 — Windows

Ces commandes s’exécutent dans PowerShell. Elles conservent la base PostgreSQL existante et le fichier `.env`.

## 1. Arrêter l’ancienne version

```powershell
Set-Location C:\Projets\mpm-ordonnancement
docker compose down
```

## 2. Créer une sauvegarde du code

```powershell
Set-Location C:\Projets
Copy-Item .\mpm-ordonnancement .\mpm-ordonnancement-backup -Recurse
```

## 3. Extraire le paquet V2

Adaptez uniquement le chemin du fichier ZIP si votre navigateur l’a enregistré ailleurs.

```powershell
Expand-Archive -Path "$HOME\Downloads\MPM-Pilot-V2.zip" -DestinationPath "C:\Projets\mpm-ordonnancement" -Force
```

## 4. Lancer l’installation automatisée

```powershell
Set-Location C:\Projets\mpm-ordonnancement
Set-ExecutionPolicy -Scope Process Bypass
.\upgrade-v2.ps1
```

Le script construit les images, lance 13 tests, compile le frontend, démarre PostgreSQL/FastAPI/React et contrôle l’API.

## 5. Ouvrir l’application

- application : <http://localhost:5173>
- documentation API : <http://localhost:8000/docs>

Sur la page d’accueil, choisissez **Créer un compte**, puis connectez-vous. Dans T.ant., saisissez par exemple `A, B, C`.

## Contrôles utiles

```powershell
docker compose ps
.\test.ps1
.\check.ps1
Invoke-RestMethod http://localhost:8000/api/v1/health
```

## En cas de problème

```powershell
docker compose logs --tail=150 backend
docker compose logs --tail=150 frontend
```

Pour revenir au code précédent, arrêtez les conteneurs et restaurez `C:\Projets\mpm-ordonnancement-backup`. N’exécutez pas `docker compose down -v`, car l’option `-v` supprimerait les données PostgreSQL.
