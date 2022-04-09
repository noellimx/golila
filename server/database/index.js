import sequelize from "./connection/index.js";

import initModels from "./models/init/index.js";


sequelize.truncate({ cascade: true })
initModels(sequelize);
export default sequelize;
