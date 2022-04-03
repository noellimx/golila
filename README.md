# Development Notes

## This is a mono repo.

## Server

Please note no production build.

### Database

using PostgreSQL with Sequelize

`./database/config/config.js` refer config for database settings
`./database/ERD/[hash].png` ERD Snapshots with filename as migration hash

[lucidchart](https://lucid.app/lucidchart/ace1cdac-b17b-49e0-a04f-3f69d17f598c/edit?invitationId=inv_9788bdc8-aa64-4d17-8180-88289227ac33)

#### Engine

Go to step 2 if existing database is used (update to latest migration only).

- `./dev.sh` Ensure psql local or remote service has been started.

Recreate an empty database, migrate and seed data.

Custom scripts:

- Initialize database schemas using Sequelize migrations.
  `npm run db:migrate` migrate
- `npm run seed` This is a reseed operation. Use models for seeding instead of sequelize-cli.

#### Adding migrations

`npm run gen:migrate [name]` generate new migration file where name is appended to the file name

### Network / Controller

`npm run server-dev` run hot.

[ ] remove package CleanWebpackPlugin
[ ] check if Sequelize accept heroku psql connection string

## Client

`npm run client-dev` build client hot
