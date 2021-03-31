# Connect

An open platform to save anonymous data coming from any application using this API

## Usage

If you want to use the connect api service see the full [usage guide](./docs/usage.md) to learn more about it.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

What things you need to install the software

```
node v12.5+
yarn v1.16+
docker-compose v1.23+ (or a Mongo database)
```

### Installing

Setup env variables.

```
cp .env.dist .env
```

Edit the .env file to set your custom values.

The parse dashboard password have to be bcrypt hash (see https://bcrypt-generator.com/)

[Create a new OAuth application](https://github.com/settings/applications/new) and set the callback URL to _PUBLIC_URL_/login/github

Start the docker compose to get a mongo db ready to use

```
docker-compose up -d
```

Alternatively, you can use a Mongo DB without Docker, but you will need to create the three databases `MONGO_DB_NAME`, `MONGO_DB_NAME-api`and `MONGO_DB_NAME-sandbox` and give readWrite access to the user `MONGO_USERNAME` ad defined in the environment variables. If the Mongo DB is in your local computer and you want to avoid this step, you can leave blank the variables `MONGO_USERNAME` and `MONGO_PASSWORD` so Mongo DB will be accessed without access control and connect will automatically create the tables when needed.

Install the node modules

```
yarn install
```

Build the react application

```
yarn build.dev
```

The project is ready to run

```
yarn start.sandbox
yarn start
```

### Running the tests

To run jest tests :

```
yarn test
```
