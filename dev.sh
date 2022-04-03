#!/bin/bash

# rm -rf node_modules
# rm package-lock.json
# npm i 

psql -d postgres -f dev.sql
npm run db:create
npm run db:migrate
npm run seed
# npx sequelize db:migrate