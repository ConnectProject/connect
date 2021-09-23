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

- Installer MongoDB (suivre https://docs.mongodb.com/manual/installation/):

  - Créer trois tables `MONGO_DB_NAME`, `MONGO_DB_NAME-api`, `MONGO_DB_NAME-sandbox` (remplacer `MONGO_DB_NAME` par le nom de la table souhaité, example: `connect`):
  - `mongo`
  - `var user = "connect"`
  - `var passwd = "connect"`
  - `use connect`
  - `db.createUser({user: user, pwd: passwd, roles: ["readWrite"]});`

- Installer node et yarn (suivre https://classic.yarnpkg.com/en/docs/install/#centos-stable

  - `curl --silent --location https://rpm.nodesource.com/setup_12.x | sudo bash -`
  - `curl --silent --location https://dl.yarnpkg.com/rpm/yarn.repo | sudo tee /etc/yum.repos.d/yarn.repo`
  - `sudo yum install nodejs`
  - `sudo yum install yarn`
  - `sudo yum install gcc-c++`

- Install pm2
  - `sudo npm install pm2 -g`

## Installation de Connect

- `cd /opt`
- `sudo mkdir connect`
- `sudo chown $USER connect`
- `git clone https://github.com/ConnectProject/connect/`
- Ouvrir le fichier `.env`, et configurer les variables ayant besoin de l'être (suivre les indications en commentaires)
- `pm2 start`
- L'application devrait démarrer, et être disponible en http sur les ports 3000, 3001
- Save the pm2 process list: `pm2 save`
- Configure pm2 startup script: `pm2 startup` and execute the command given by pm2

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

## Configure crontab to renew the certificate

- run `sudo crontab -e` and add the following:

```
PATH=/sbin:/bin:/usr/sbin:/usr/bin

45 2 * * 6 certbot renew && nginx -s reload
```

## Installation de webhook

Configuration de webhook pour effectuer la mise à jour du serveur de manière automatique

- `sudo mkdir /opt/webhook`
- `sudo chown $USER /opt/webhook`
- Download release from https://github.com/adnanh/webhook/releases and extract the `webhook` binary to `/opt/webhook`
- Copy the files `deploy-connect.sh` and `deploy-hooks.json` to the `/opt/webhook` folder
- Fill the secret field according to the `WEBHOOK_SECRET` variable on github in `deploy-hooks.json`
- Configure the webhook service:
  - Copy `webhook.service` to `/etc/systemd/system/`
  - `sudo systemctl start webhook`
  - `systemctl status webhook`
  - `curl localhost:9990/hooks/deploy-connect` should answer: `Hook rules were not satisfied.`
  - `sudo systemctl enable webhook`
- Add the following redirection to the nginx server:

```
location /hooks/ {
    proxy_pass http://127.0.0.1:9990;
}
```

- `sudo nginx -s reload`

## Pare-feu

- Les ports 3000,3001 de la machine APP01 n'ont pas besoin d'être accessibles depuis une machine autre que le reverse proxy mentionné ci-dessus, aussi, ils ne devraient pas l'être si possible.

## Accès aux logs

Tout d'abord, trouver l'id du processus que l'on souhaite étudier avec `pm2 list`

Les logs sont stockés par pm2 dans le dossier `$HOME/.pm2/logs/`.
Il est cependant plus pratique d'y accéder à l'aide de la commande `pm2 log [process-id]`, ou `pm2 log`

## Vérification du bon fonctionnement de l'app

L'ensemble des composants de l'application exposée doit répondre un code http 200 sur une url spécifique, voici des exemples de commandes curl permettant de réaliser ce test :

- `curl -v connect-project.io/`
- `curl -v connect-project.io/parse`
- `curl -v connect-project.io/dashboard`
- `curl -v connect-project.io/swagger`
- `curl -v connect-project.io/parse-sandbox`
