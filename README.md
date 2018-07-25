# Atropos Server

## This project is still in development, do not use in production yet.

This is Atropos Community Software Server. It provides api endpoints to create and manage all aspects of Atropos.
Here are some of the core features for this project:

  - Public API to content
  - Private API for users to manage content
  - Generate Thumbnails for images and pdf
  - Send emails to users
  - and much more..

## Setup

After cloning this repo, run `npm install`.

Then copy the .env.example file and rename it to .env. Review all settings in the env file and make sure to configure the database correctly.

Next you can migrate the database:

```sh
node ace migration:run
```

And finally you fill have to generate an application key:
```sh
node ace key:generate
```

# Installation

After the initial setup you can execute the folowing command to start the install wizzard:

```sh
node ace install
```

This wizzard will setup the required settings in the database, as well let you create you initial admin user.


## Start Service

The atropos server consists of 3 components:

### API Server

This serves the main application and http endpoints. You can start is as follows:

```sh
node server.js
```

### Queue worker

The worker processes all background tasks like creating thumnails for images and sending emails.

```sh
node ace kue:listen
```

### Scheduler

And finally the scheduler which is responsible for dispatching jobs that need to happen on a regular interval.
For example optimizing the database or removing old login tokens .

```sh
node ace run:scheduler
```

## Development

To make development easier, you can seed the database with sample data:

```sh
node ace migration:refresh
node ace seed
```

You can also start the server using the `npm run dev` command, which will watch your files for changes and automatically restart the server when you change something.
