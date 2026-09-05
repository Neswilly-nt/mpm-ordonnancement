# Scripts

Les scripts sont à exécuter depuis n'importe quel dossier : ils se repositionnent à la racine du projet avant de lancer Docker Compose.

| Script | Usage |
| --- | --- |
| `install.sh` | Construit les images et démarre les services. |
| `deploy.sh` | Reconstruit les images et démarre les services en arrière-plan. |
| `test.sh` | Lance les tests backend et frontend. |
| `check.sh` | Vérifie la configuration Docker, le lint et le build frontend. |
| `deploy.ps1` | Version PowerShell du déploiement. |
| `test.ps1` | Version PowerShell des tests. |
| `check.ps1` | Version PowerShell des contrôles. |

Les scripts PowerShell peuvent nécessiter :

```powershell
Set-ExecutionPolicy -Scope Process Bypass
```
