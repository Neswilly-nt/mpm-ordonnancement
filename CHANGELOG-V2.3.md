# MPM Pilot V2.3.1

## Graphe interactif

- disposition verrouillée par défaut pour éviter les déplacements accidentels ;
- bouton explicite « Modifier la disposition » ;
- déplacement manuel de chaque sommet lorsque le mode est actif ;
- arcs attachés aux sommets et mis à jour automatiquement pendant le déplacement ;
- bouton « Verrouiller la disposition » pour figer le résultat choisi ;
- bouton « Réinitialiser » pour restaurer la disposition automatique Dagre ;
- suppression du cadenas ambigu des contrôles React Flow.

## Compte utilisateur

- fermeture automatique du menu au clic ou au toucher en dehors ;
- fermeture également disponible avec la touche Échap ;
- fermeture du menu avant la déconnexion.

## Impression et PDF

- bouton « Imprimer » distinct pour imprimer la page complète ;
- bouton « Télécharger le PDF » distinct ;
- génération locale d’un véritable fichier PDF, sans envoi des résultats vers un service tiers ;
- rapport PDF en format A4 paysage avec synthèse, chemins critiques, tableau MPM et légendes ;
- nom de fichier daté : `rapport-mpm-AAAA-MM-JJ.pdf`.

## Vérifications

- délai des tests asynchrones adapté aux performances de Docker Desktop sous Windows ;
- test du verrouillage et du déverrouillage du graphe ;
- test de fermeture du menu au clic extérieur ;
- test de la signature et du type du PDF ;
- 7 tests backend et 9 tests frontend ;
- build TypeScript/Vite, ESLint et Ruff.
