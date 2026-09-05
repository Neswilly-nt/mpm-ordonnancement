# MPM Pilot

MPM Pilot est une application web d'ordonnancement qui permet de construire un réseau de tâches, d'en calculer les dates et les marges, puis d'identifier les chemins critiques.

## Objectif

L'application aide à analyser les contraintes entre tâches d'un projet selon la méthode MPM (Méthode des Potentiels Métra). Elle fournit une représentation graphique du réseau et les indicateurs nécessaires à l'analyse du planning.

## Fonctionnalités

- création et modification des tâches ;
- gestion des durées et des dépendances ;
- génération du graphe MPM ;
- calcul des dates au plus tôt ;
- calcul des dates au plus tard ;
- calcul des marges totale et libre ;
- identification des tâches et des chemins critiques ;
- export local d'un rapport PDF ;
- authentification des utilisateurs.

## Architecture

```text
Utilisateur
    |
    v
Frontend React
    |
    v
API FastAPI
    |
    v
PostgreSQL
```

Le calcul du réseau MPM est réalisé dans le backend avec NetworkX. Le frontend utilise React Flow pour afficher le graphe.

## Technologies utilisées

- **React, TypeScript et Vite** : interface web et compilation du frontend ;
- **FastAPI et Pydantic** : API HTTP et validation des données ;
- **NetworkX** : validation et parcours du graphe de dépendances ;
- **SQLAlchemy et PostgreSQL** : persistance des utilisateurs et des projets ;
- **Docker Compose** : exécution coordonnée de PostgreSQL, du backend et du frontend ;
- **Pytest, Vitest, Ruff et ESLint** : tests et contrôles de qualité.

## Installation rapide

### Avec Docker

Prérequis : Git et Docker Desktop ou Docker Engine avec Docker Compose.

```bash
git clone https://github.com/Neswilly-nt/mpm-ordonnancement.git
cd mpm-ordonnancement
cp .env.example .env
docker compose up -d --build
```

Sous PowerShell, la copie de l'environnement s'effectue avec :

```powershell
Copy-Item .env.example .env
docker compose up -d --build
```

L'installation détaillée pour Windows, Linux et macOS se trouve dans [GUIDE-INSTALLATION.md](GUIDE-INSTALLATION.md).

### Installation manuelle

L'installation manuelle nécessite Python 3.13, Node.js 22 et PostgreSQL. Les dépendances backend sont listées dans [backend/requirements.txt](backend/requirements.txt) et [backend/requirements-dev.txt](backend/requirements-dev.txt). Les dépendances frontend sont décrites dans [frontend/package.json](frontend/package.json).

Pour l'installation courante, Docker Compose reste recommandé.

## Structure du projet

```text
backend/                 API FastAPI, domaine MPM et tests Python
frontend/                interface React, styles et tests frontend
docs/                    documentation API et architecture
scripts/                 scripts d'installation, de contrôle et de test
docker-compose.yml       orchestration des services
.env.example             modèle de configuration locale
```

## Tests

Depuis la racine du projet :

```bash
./scripts/test.sh
./scripts/check.sh
```

Sous Windows :

```powershell
.\scripts\test.ps1
.\scripts\check.ps1
```

Les scripts exécutent les tests backend et frontend, puis les contrôles de lint et le build frontend.

## Utilisation

Après le démarrage :

- application : <http://localhost:5173> ;
- documentation interactive de l'API : <http://localhost:8000/docs> ;
- état de santé de l'API : <http://localhost:8000/api/v1/health>.

Créez un compte, ajoutez les tâches et renseignez leurs antécédents séparés par des virgules ou des points-virgules. Le graphe, les dates, les marges et les chemins critiques sont calculés à partir de ces données.

Pour arrêter les services sans supprimer les données PostgreSQL :

```bash
docker compose down
```

La clé `JWT_SECRET_KEY` doit rester privée. Le fichier `.env` est local et n'est pas destiné à être versionné.
