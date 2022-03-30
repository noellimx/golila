import { Sequelize } from "sequelize";
import configs from "../config/config.js";

const getDbCredentials = (env, configs) => {
  const config = configs[env];

  if (env === "production") {
    // Break apart the Heroku database url and rebuild the configs we need
    const { DATABASE_URL } = process.env;
    const dbUrl = URL(DATABASE_URL);
    const username = dbUrl.auth.slice(0, dbUrl.auth.indexOf(":"));
    const password = dbUrl.auth.slice(
      dbUrl.auth.indexOf(":") + 1,
      dbUrl.auth.length
    );
    const dbName = dbUrl.path.slice(1);
    const host = dbUrl.hostname;
    const { port } = dbUrl;
    config.host = host;
    config.port = port;
    return [dbName, username, password, config];
  }

  // If env is not production, retrieve DB auth details from the config
  else {
    return [config.database, config.username, config.password, config];
  }
};
const env = process.env.NODE_ENV || "development";

const dbCredentials = getDbCredentials(env, configs);

const sequelize = new Sequelize(...dbCredentials);

const db = {
  sequelize,
  Sequelize,
};

export default db;
