import initModelUser from "./user.js";
import initModelRoom from "./room.js";
import initModelParticipant from "./participant.js";
const initModels = (db) => {
  const User = initModelUser(db);
  const Room = initModelRoom(db);
  const Participant = initModelParticipant(db);
};

export default initModels;
