import sequel from "./connection/index.mjs";
import { Sequelize } from "sequelize";

import initModels from "./models/init/index.mjs";

/**
 *
 * @typedef {Object} AppDatabase Namespace for application database.
 * @property {function(new:Sequelize)} Sequelize Library class reference for static methods.
 * @property {Sequelize} sequel Connection
 */
const db = { sequel, Sequelize };
initModels(db);

export default db;
