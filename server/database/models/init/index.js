import initModelUser from "./user.js";
import initModelRoom from "./room.js"
const initModels = (db) => {
  const User = initModelUser(db);
  const Room = initModelRoom(db)
};

export default initModels;
