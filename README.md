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

Go to custom scripts if existing database is used (update to latest migration only).

- `./dev.sh` Ensure psql local or remote service has been started.

Recreate an empty database, migrate and seed data.

Custom scripts:

- Initialize database schemas using Sequelize migrations.
  `npm run db:migrate` migrate
- `npm run seed` This is a reseed operation. Use models for seeding instead of sequelize-cli.

#### Adding migrations

`npm run gen:migrate [name]` generate new migration file where name is appended to the file name. NOTE: change .js to .cjs

### Network / Controller

`npm run server-dev` run hot.

### Client

`npm run client-dev` build client hot

# To Do

## Glitch

[ ] First keydown after game start does not emit to server.

## Feat

[ ] remove package CleanWebpackPlugin
[ ] check if Sequelize accept heroku psql connection string
[ ] how to host on heroku????

[x] not all users in room receive game-start event
[ ] need to tear down previous room events

[ ] Game: submit chain (See #1244, #1245)

- tally with gameplay.chain
- first tally will register score, one row per chain (chain, round , team, score)

[ ] Game #1244: set timer

- [Moment Game End] timer runs out is triggered and game will be locked on first successful submission after gameplay end time.

- Server: On game ends, notify client game ends

[ ] Game #1245: Scoring

- Create table scoring
- Client: On notify game ends, ask whats the tally

[ ] Scoring: _Only players staying until the end can claim money_

- transaction should occur at [Moment Game End]. See Game #1244
- payout for each player is total of the team.

[ ] User Display: Credit System (navbar + emit)

[ ] Board.dormantPlane tear down if game is not active

[ ] CSS

- Spawn time
- general arrangement

[ ] Registration Page

[ ] DEPLOYMENT

### SPRINT VIEWS

[ ] show room name instead of room id in the active room page
[ ] show room name instead of room id in the participating room
[ ] joinable rooms as nice cards
[ ] participating room staging : 1- tabular room, 2- hovering colors
[ ] participating room playing : 1- spawning time flash, 2- coins img, 3 someone hit flash
[ ] participating room end of round : tally
[ ] ERD update
[x] clear fields on registration request submission
[ ] bonus points for winning team
[ ] Optimise settle game by database calls



### Ponderings

- How to ensure an event attaches a function once?