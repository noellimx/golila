#!/bin/bash

# rm -rf node_modules
# rm package-lock.json
# npm i 

psql -d postgres -f dev.sql
npx sequelize db:create
# npx sequelize db:migrate