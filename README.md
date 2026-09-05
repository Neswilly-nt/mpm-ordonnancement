# MPM Pilot — Ordonnancement des tâches

Application web professionnelle d’ordonnancement conforme à la méthode MPM enseignée en Recherche Opérationnelle.

## Conformité MPM

- un sommet représente une tâche ;
- un arc représente une contrainte de précédence ;
- tableau `Tâche / Durée / T.ant. / T.suc.` ;
- calcul des dates au plus tôt et au plus tard ;
- calcul de la marge totale et de la marge libre ;
- identification de toutes les tâches et de tous les chemins critiques ;
- sommets Début et Fin explicitement placés aux extrémités du graphe.

Pour une tâche `j` :

```text
tôt(j) = max(tôt(i) + durée(i)) pour tous les antécédents i
tard(i) = min(tard(j) - durée(i)) pour tous les successeurs j
MT(i) = tard(i) - tôt(i)
ML(i) = min(tôt(j) - tôt(i) - durée(i))
```

## Architecture

```text
mpm-ordonnancement/
├── backend/
│   ├── app/
│   │   ├── api/          # API MPM et authentification JWT
│   │   ├── core/         # configuration, base, sécurité
│   │   ├── models/       # modèles SQLAlchemy
│   │   ├── schemas/      # schémas Pydantic
│   │   └── services/     # algorithme MPM NetworkX
│   └── tests/
├── frontend/
│   └── src/
│       ├── components/   # graphe React Flow et navigation
│       ├── context/      # session et notifications
│       ├── pages/        # accueil, connexion, inscription, analyse
│       ├── services/     # client Axios
│       ├── types/
│       └── utils/
├── docs/
├── docker-compose.yml
├── setup.sh / install.sh / test.sh / check.sh / deploy.sh
└── upgrade-v2.ps1 / test.ps1 / check.ps1 / deploy.ps1
```

## Fonctionnalités V2

- landing page et espace d’analyse protégé ;
- inscription, connexion et déconnexion ;
- mots de passe hachés avec Argon2 et session JWT ;
- profil connecté visible avec initiales, nom et adresse email ;
- notifications temporaires et animations fluides ;
- saisie de plusieurs antécédents avec virgules ou points-virgules (`A, B, C`) ;
- durée effaçable et validation différée ;
- tableau MPM avec libellés académiques complets ;
- graphe circulaire inspiré du schéma de cours ;
- légendes T.ant., T.suc., MT, ML, dates et arcs ;
- impression de la page et téléchargement direct d’un rapport PDF ;
- graphe verrouillé par défaut, avec mode de déplacement manuel des sommets ;
- arcs attachés aux sommets pendant leur déplacement ;
- menu du compte fermé automatiquement au clic extérieur ou avec Échap.

Les améliorations visuelles et ergonomiques sont détaillées dans `CHANGELOG-V2.2.md` et `CHANGELOG-V2.3.md`.

## Installation recommandée sous Windows

Depuis PowerShell, à la racine du projet :

```powershell
Set-ExecutionPolicy -Scope Process Bypass
.\upgrade-v2.ps1
```

Le script prépare `.env`, construit les images, exécute les tests, démarre les services et vérifie l’API.

Accès :

- application : <http://localhost:5173>
- documentation FastAPI : <http://localhost:8000/docs>
- contrôle de santé : <http://localhost:8000/api/v1/health>

## Commandes quotidiennes

```powershell
docker compose up -d
docker compose ps
.\test.ps1
.\check.ps1
docker compose logs --tail=100 backend
docker compose logs --tail=100 frontend
docker compose down
```

Les données PostgreSQL sont conservées dans le volume `postgres_data` après `docker compose down`.

## Tests

Backend : calculs du cours, tâches parallèles, marge libre, cycles, authentification, mot de passe incorrect et protection de l’API.

Frontend : accueil, connexion, trois antécédents, séparateurs virgule/point-virgule, durée vide et durée décimale.

## Vocabulaire recommandé

Les intitulés corrects sont **Début au plus tôt**, **Fin au plus tôt**, **Début au plus tard** et **Fin au plus tard**. Les formes abrégées « Début tard » et « Fin tard » sont évitées dans l’interface.

## Sécurité avant une mise en production publique

La clé `JWT_SECRET_KEY` doit rester secrète. `upgrade-v2.ps1` en génère automatiquement une valeur locale. Pour une mise en production Internet, ajouter HTTPS, migrations Alembic, limitation de débit, récupération de mot de passe et gestion sécurisée des secrets.
