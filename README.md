# MPM Pilot

MPM Pilot est une application web d'ordonnancement des tâches basée sur la Méthode des Potentiels Métra (MPM). Elle aide à construire un planning, à analyser les dépendances entre tâches et à visualiser les résultats dans un graphe MPM.

## Fonctionnalités

- création dynamique de projets et de tâches ;
- gestion des dépendances entre tâches ;
- calcul automatique des dates au plus tôt ;
- calcul automatique des dates au plus tard ;
- calcul des marges totales et libres ;
- identification des tâches et du chemin critique ;
- génération automatique du graphe MPM ;
- authentification des utilisateurs ;
- export local d'un rapport PDF.

## Stack technique

### Frontend

- React et TypeScript ;
- Vite ;
- React Flow pour la visualisation du graphe ;
- déploiement sur Vercel.

### Backend

- FastAPI Python ;
- SQLAlchemy ;
- PostgreSQL ;
- NetworkX pour les calculs du graphe MPM ;
- authentification JWT ;
- déploiement sur Render.

### Base de données et déploiement

- PostgreSQL hébergé sur Neon Cloud ;
- Docker Compose pour l'environnement local ;
- frontend déployé sur Vercel ;
- backend déployé sur Render.

## Architecture

```text
Utilisateur
    |
    v
Frontend React/Vite (Vercel)
    |
    | API REST
    v
Backend FastAPI (Render)
    |
    v
PostgreSQL Neon
```

Le frontend envoie les données de planification à l'API FastAPI. Le backend valide le graphe, exécute les calculs MPM avec NetworkX et retourne les dates, marges, tâches critiques et chemins critiques.

## Liens du projet

- **GitHub :** <https://github.com/Neswilly-nt/mpm-ordonnancement>
- **Application en ligne :** <https://mpm-frontend-five.vercel.app>
- **API Backend :** <https://mpm-backend-keuy.onrender.com>
- **Swagger :** <https://mpm-backend-keuy.onrender.com/docs>
- **Health check :** <https://mpm-backend-keuy.onrender.com/api/v1/health>

## Installation locale

### Prérequis

- Git ;
- Docker Desktop sous Windows et macOS, ou Docker Engine sous Linux ;
- Docker Compose v2.

### Avec Docker Compose

```bash
git clone https://github.com/Neswilly-nt/mpm-ordonnancement.git
cd mpm-ordonnancement
cp .env.example .env
docker compose up -d --build
```

Sous PowerShell :

```powershell
Copy-Item .env.example .env
docker compose up -d --build
```

Les services sont accessibles aux adresses suivantes :

- frontend : <http://localhost:5173> ;
- API : <http://localhost:8000> ;
- documentation Swagger : <http://localhost:8000/docs> ;
- health check : <http://localhost:8000/api/v1/health>.

Pour vérifier l'état des conteneurs :

```bash
docker compose ps
```

Pour arrêter les services sans supprimer le volume PostgreSQL :

```bash
docker compose down
```

### Lancement manuel

Pour lancer les composants séparément, installez Python 3.13, Node.js 22 et PostgreSQL.

Backend :

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements-dev.txt
uvicorn app.main:app --reload --port 8000
```

Frontend :

```bash
cd frontend
npm ci
npm run dev
```

Sous Windows PowerShell, activez l'environnement Python avec `.\.venv\Scripts\Activate.ps1`.

### Variables d'environnement

Copiez [.env.example](.env.example) vers `.env`, puis adaptez les valeurs :

- `DATABASE_URL` : URL de connexion PostgreSQL ;
- `JWT_SECRET_KEY` : clé secrète utilisée pour signer les jetons ;
- `ACCESS_TOKEN_EXPIRE_MINUTES` : durée de validité des jetons ;
- `CORS_ORIGINS` : origine autorisée du frontend, par exemple `http://localhost:5173` ;
- `VITE_API_URL` : URL de l'API utilisée par le frontend.

Ne versionnez jamais `.env` et utilisez une clé JWT robuste en production.

## Structure du projet

```text
backend/                 API FastAPI, calcul MPM et tests Python
frontend/                interface React, styles et tests frontend
docs/                    documentation API et architecture
scripts/                 scripts d'installation, de déploiement et de test
docker-compose.yml       orchestration locale des services
.env.example             modèle de configuration
```

## Tests

Depuis la racine du projet :

```bash
./scripts/test.sh
./scripts/check.sh
```

Sous Windows PowerShell :

```powershell
.\scripts\test.ps1
.\scripts\check.ps1
```

Les scripts exécutent les tests backend et frontend, puis les contrôles de lint et le build frontend.
