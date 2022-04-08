import { Sequelize } from "sequelize";
import CONFIGS from "../config/config.js";


const ENVIRONMENT = process.env.NODE_ENV || "development";

console.log(`ENVIRONMENT is ${ENVIRONMENT}`)


const newSequelize = (env, configs) => {
  const config = configs[env];

  if (env === "production") {
    // Break apart the Heroku database url and rebuild the configs we need
    console.log(`[Get Db Credentials] production ?=`)
    console.log(config)

    const opts = config;
    const { DATABASE_URL} = process.env;
    return new Sequelize(DATABASE_URL, opts);
  }

  else if (env === "development"){
    const { database, username, password, host
 ,dialect} = config;

    const opts = {
      host,
        dialect ,
    }

    return new Sequelize(database, username, password, opts);
  }

  throw new Error(`[getDbCredentials] Environment not recognised`)
};


console.log("Creating sequelize");
const sequelize = newSequelize(ENVIRONMENT,CONFIGS)

console.log(`Connected. Database Name: ${sequelize.getDatabaseName()}`);

export default sequelize;
