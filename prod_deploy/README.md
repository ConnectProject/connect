# Install from scratch

- Installer le serveur APP01
- Les instructions suivantes sont à exécuter en tant que root
- Installer docker (suivre https://docs.docker.com/install/linux/docker-ce/ubuntu/)
- Installer docker-compose : `apt-get install docker-compose`
- Installer mongoDb (suivre https://docs.mongodb.com/manual/installation/)
- Créer trois tables `MONGO_DB_NAME`, `MONGO_DB_NAME-api`, `MONGO_DB_NAME-sandbox` (remplacer `MONGO_DB_NAME` par le nom de la table souhaité, example: `connect`)

Dans toutes les commandes suivantes, remplacer VERSION_NUMBER par le numéro de la version actuellement déployée. (par exemple, `v1.0.0`)

- `cd /opt/connect`
- `mkdir connect-VERSION_NUMBER`
- `cd connect-VERSION_NUMBER`
- Copier les fichiers `docker-compose.yml` and `.env` fournis dans ce dossier
- Remplacer la valeur de VERSION_NUMBER dans le `.env` par le numéro de version actuellement déployée
- Ouvrir le fichier `.env`, et configurer les variables ayant besoin de l'être (suivre les indications en commentaires)
- `docker-compose up -d`
- L'application devrait démarrer, et être disponible en http sur les ports 3000, 3001

- Mettre en place un reverse proxy réalisant la terminaison TLS, accessible depuis Internet, et proxyfiant les requêtes de la manière suivante :
  - https://connect-project.io/parse-sandbox -> port 3001 de APP01
  - https://connect-project.io/ -> port 3000 de APP01
  - Redirection permanente (code HTTP 301 ou 308) des url ci-dessus de http vers https
- Créer les entrées DNS requises pour que le trafic arrive sur ce reverse proxy
- Vérifier que l'ensemble des composants de l'application fonctionnent correctement (chaque commande ci-dessous doit répondre un code HTTP 200)
  - `curl -v localhost:3000/`
  - `curl -v localhost:3000/parse`
  - `curl -v localhost:3000/dashboard`
  - `curl -v localhost:3000/swagger`
  - `curl -v localhost:3001/parse-sandbox`

# Pare-feu

- Les ports 3000,3001 de la machine APP01 n'ont pas besoin d'être accessibles depuis une machine autre que le reverse proxy mentionné ci-dessus, aussi, ils ne devraient pas l'être si possible.

# Accès aux logs

Tout d'abord, trouver l'id du conteneur que l'on souhaite étudier avec `docker-compose ps`

Les logs sont stockés par le daemon docker dans `/var/lib/docker/containers/[container-id]/[container-id]-json.log`.
Il est cependant plus pratique d'y accéder à l'aide de la commande `docker logs [container-id]`, ou `docker-compose logs`

# Vérification du bon fonctionnement de l'app

L'ensemble des composants de l'application exposés doit répondre un code http 200 sur une url spécifique, voici des exemples de commandes curl permettant de réaliser ce test :

- `curl -v localhost:3000/`
- `curl -v localhost:3000/parse`
- `curl -v localhost:3000/dashboard`
- `curl -v localhost:3000/swagger`
- `curl -v localhost:3001/parse-sandbox`

# Mise à jour

Lors d'une mise à jour, vous aurez un nouveau numéro de version à déployer (remplacer les occurrences de NEW_VERSION_NUMBER par ce numéro de version)

La procédure est à exécuter avec l'utilisateur root.

- `cd /opt/connect`
- `mkdir connect-NEW_VERSION_NUMBER`
- Copier dans ce dossier les fichiers `docker-compose.yml` et `.env` (à moins que l'on vous en fournisse de nouveaux, utiliser ceux de la version précédente)
- `cd connect-NEW_VERSION_NUMBER`
- Remplacer la valeur de VERSION_NUMBER dans `.env` par NEW_VERSION_NUMBER
- `cd ../connect-OLD_VERSION_NUMBER`
- `docker-compose down`
- `cd ../connect-NEW_VERSION_NUMBER`
- `docker-compose up -d`
- Vérifier que le site fonctionne bien
