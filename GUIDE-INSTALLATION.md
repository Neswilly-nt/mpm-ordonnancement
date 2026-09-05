# Guide d'installation

Ce guide décrit l'installation de MPM Pilot sur Windows, Linux et macOS avec Docker Compose.

## Prérequis

- Git ;
- Docker Desktop sous Windows et macOS, ou Docker Engine sous Linux ;
- Docker Compose v2.

Vérifiez les installations :

```bash
git --version
docker --version
docker compose version
```

## 1. Cloner le projet

```bash
git clone https://github.com/Neswilly-nt/mpm-ordonnancement.git
cd mpm-ordonnancement
```

## 2. Configurer l'environnement

Linux et macOS :

```bash
cp .env.example .env
```

Windows PowerShell :

```powershell
Copy-Item .env.example .env
```

Adaptez les valeurs de `.env` si nécessaire. En particulier, utilisez une valeur privée et robuste pour `JWT_SECRET_KEY` en dehors d'un environnement de développement.

## 3. Lancer les services

Depuis la racine du projet :

```bash
docker compose up -d --build
```

Les services démarrés sont PostgreSQL, l'API FastAPI et le frontend Vite.

## 4. Vérifier les services

```bash
docker compose ps
```

Vérifiez ensuite que l'API répond :

```text
http://localhost:8000/api/v1/health
```

Les journaux peuvent être consultés avec :

```bash
docker compose logs --tail=100 backend
docker compose logs --tail=100 frontend
```

## 5. Accéder à l'application

- application : <http://localhost:5173> ;
- documentation API : <http://localhost:8000/docs>.

## Scripts du projet

Les scripts multiplateformes disponibles sont décrits dans [scripts/README.md](scripts/README.md).

## Dépannage

### Un port est déjà utilisé

Identifiez le service qui utilise le port 5173 ou 8000, arrêtez-le, puis relancez :

```bash
docker compose up -d
```

### Un service ne démarre pas

Consultez son journal et l'état des conteneurs :

```bash
docker compose ps
docker compose logs --tail=150 <service>
```

### Repartir des conteneurs

```bash
docker compose down
docker compose up -d --build
```

N'utilisez pas `docker compose down -v` sauf si vous souhaitez supprimer le volume PostgreSQL et toutes les données locales.
