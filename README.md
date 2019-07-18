# Connect

An open platform to save anonymous data coming from any application using this API

## Usage

If you want to use the connect api service see the full [usage guide](./doc/usage.md) to learn more about it.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

What things you need to install the software

```
node v12.5+
yarn v1.16+
docker-compose v1.23+
```

### Installing

Setup env variable.
The parse dashboard password have to be bcrypt hash (see https://bcrypt-generator.com/)

```
cp .env.dist .env
```

Edit the .env file to set your custom values.
Then start the docker compose to get a mongo db ready to use

```
docker-compose -d up
```

Build the react application

```
yarn build
```

The project is ready to run

```
yarn start
```

### Running the tests

To run jest tests :

```
yarn test
```
