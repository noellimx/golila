import sequelize from "./connection/index.js";

import initModels from "./models/init/index.js";

initModels(sequelize);

export default sequelize;
