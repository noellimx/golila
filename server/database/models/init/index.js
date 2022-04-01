import initModelUser from "./user.js";

const initModels = (db) => {
  const User = initModelUser(db);
};

export default initModels;
