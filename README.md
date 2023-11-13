# Wiki Marvel

## Summary

- [App information](#app-information)
- [Installation](#installation)
  - [Prerequisites](#prerequisites)
  - [Local run without Docker](#local-run-without-docker)
- [Marvel Developer](#marvel-developer)
- [Deploy](#deploy)
  - [Build and run with Docker](#build-and-run-with-docker)
- [Resources](#resources)

## App information

- App name : Wiki Marvel
- Description : Enter the name of your Marvel character to find out their description and the comics they appear in.
- App links :
  - [Repo](https://github.com/CharlesCharly/wiki-marvel)

## Installation

### Prerequisites

Populate your `.env` file with secret values as below

```sh
# Marvel developer account
MARVEL_API_PUBLIC_KEY=
MARVEL_API_PRIVATE_KEY=

# Port you want to listen to, here 3000 as example
PORT=3000
# Environment used, here dev as example
# Value is used for the config file : config.%{NODE_ENV}.js
# i.e no config file has been created for prod
NODE_ENV=dev
```

Learn how to get those values from the [Marvel Developer](#marvel-developer)

### Local run without Docker

```sh
# Install dependencies
npm install

# Run the server
npm start

# Run the server with hot-reload
npm dev

# Run the tests
npm test
```

## Marvel Developer

Create an account [Marvel Developer Portal](https://developer.marvel.com/).\
Once done, click on `My Developer Account` to access your public and private key.\

> Tip : For each new domain you are going to use, don't forget to add it in the authorized referrers section.

## Deploy

### Build and run with Docker

```sh
# Build your image on any file changes
docker build -t wiki-marvel

# Run your Docker container (with yml configuration)
docker-compose up

# Run your container if you don't want to use the yml configuration
docker run -p 3000:3000 wiki-marvel
```

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Resources

- Node.js Backend Framework : [Express](https://expressjs.com/)
- Promise based HTTP client : [Axios](https://github.com/axios/axios)
- Embedded JS templating : [EJS](https://ejs.co/)
- HTTP server mocking : [Nock](https://github.com/nock/nock)
- Testing  : [Jest](https://jestjs.io/)
