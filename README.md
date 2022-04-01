# Development Nodes

## This is a mono repo.

## Server

Please note no production build.

### Database

using PostgreSQL with Sequelize

`./database/config/config.js` refer config for database settings
`./database/ERD/[hash].png` ERD Snapshots with filename as migration hash

#### Engine

1. `./dev.sh` Ensure psql local or remote service has been started. Recreate an empty database.
2. Initialize database schemas using Sequelize migrations.
   `npm run db-migrate` migrate
3. `node seed-db.js` Use models for seeding instead of sequelize-cli.

### Network

`npm run server-dev` run hot.

[ ] remove package CleanWebpackPlugin
[ ] check if Sequelize accept heroku psql connection string
