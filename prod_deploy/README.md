# Export to docker hub

- give a new version number: `VERSION=1.0.x`
- Make sure the app is built in production mode
- `yarn build`
- `docker build -t criconnect/connect:$VERSION`
- `docker login`
- `docker push criconnect/connect:$VERSION`

# Install from scratch

## Pré-requis

- Disable password for sudo

  - `sudo visudo`
  - add the following line at the end of the file (replace `<user>` by your username:
    - `<user> ALL=(ALL) NOPASSWD: ALL`

- Installer nginx

  - `sudo yum install -y epel-release`
  - `sudo yum install -y nginx`
  - `sudo systemctl start nginx`
  - `sudo systemctl stop firewalld`

- Installer docker (suivre https://docs.docker.com/install/linux/docker-ce/centos/)

  - `sudo yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo`
  - `sudo yum install docker-ce docker-ce-cli containerd.io`
  - `sudo systemctl start docker`

- Installer docker-compose

  - `sudo yum install docker-compose`
  - `sudo groupadd docker`
  - `sudo usermod -aG docker $USER`
  - log out and log in or `newgrp docker`

- Installer MongoDB (suivre https://docs.mongodb.com/manual/installation/):

  - Créer trois tables `MONGO_DB_NAME`, `MONGO_DB_NAME-api`, `MONGO_DB_NAME-sandbox` (remplacer `MONGO_DB_NAME` par le nom de la table souhaité, example: `connect`):
  - `mongo`
  - `var user = "connect"`
  - `var passwd = "connect"`
  - `use connect`
  - `db.createUser({user: user, pwd: passwd, roles: ["readWrite"]});`
  - `connect-api`
  - `db.createUser({user: user, pwd: passwd, roles: ["readWrite"]});`
  - `connect-sandbox`
  - `db.createUser({user: user, pwd: passwd, roles: ["readWrite"]});`

- Installer node et yarn (suivre https://classic.yarnpkg.com/en/docs/install/#centos-stable, non nécessaire pour lancer le serveur avec docker)
  - `curl --silent --location https://rpm.nodesource.com/setup_12.x | sudo bash -`
  - `curl --silent --location https://dl.yarnpkg.com/rpm/yarn.repo | sudo tee /etc/yum.repos.d/yarn.repo`
  - `sudo yum install nodejs`
  - `sudo yum install yarn`
  - `sudo yum install gcc-c++`

## Installation de Connect

Dans toutes les commandes suivantes, remplacer `VERSION_NUMBER` par le numéro de la version à déployer. (par exemple, `1.0.0`)

- `cd /opt/connect`
- `mkdir connect-VERSION_NUMBER`
- `cd connect-VERSION_NUMBER`
- Copier les fichiers `docker-compose.yml` and `.env` fournis dans ce dossier
- Remplacer la valeur de VERSION_NUMBER dans le `.env` par le numéro de version actuellement déployée
- Ouvrir le fichier `.env`, et configurer les variables ayant besoin de l'être (suivre les indications en commentaires)
- `docker-compose up -d`
- L'application devrait démarrer, et être disponible en http sur les ports 3000, 3001

- Mettre en place un reverse proxy réalisant la terminaison TLS, accessible depuis Internet, et proxyfiant les requêtes de la manière suivante :
  - https://connect-project.io/parse-sandbox -> port 3001 local
  - https://connect-project.io/ -> port 3000 local
  - Redirection permanente (code HTTP 301 ou 308) des url ci-dessus de http vers https: `sudo certbot --nginx`
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

L'ensemble des composants de l'application exposée doit répondre un code http 200 sur une url spécifique, voici des exemples de commandes curl permettant de réaliser ce test :

- `curl -v connect-project.io/`
- `curl -v connect-project.io/parse`
- `curl -v connect-project.io/dashboard`
- `curl -v connect-project.io/swagger`
- `curl -v connect-project.io/parse-sandbox`

# Mise à jour

Lors d'une mise à jour, vous aurez un nouveau numéro de version à déployer (remplacer les occurrences de NEW_VERSION_NUMBER par ce numéro de version)

La procédure est à exécuter avec l'utilisateur root.

- `cd /opt/connect`
- `mkdir connect-NEW_VERSION_NUMBER`
- Copier dans ce dossier les fichiers `docker-compose.yml` et `.env` (à moins que l'on vous en fournisse de nouveaux, utiliser ceux de la version précédente)
- `cd connect-NEW_VERSION_NUMBER`
- Remplacer la valeur de `VERSION_NUMBER` dans `.env` par `NEW_VERSION_NUMBER`
- `cd ../connect-OLD_VERSION_NUMBER`
- `docker-compose down`
- `cd ../connect-NEW_VERSION_NUMBER`
- `docker-compose up -d`
- Vérifier que le site fonctionne bien
