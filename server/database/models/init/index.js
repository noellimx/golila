import initModelUser from "./user.js";
import initModelRoom from "./room.js";
import initModelParticipant from "./participant.js";
import initModelLastKnownSessionUser from "./lastKnownSessionUser.js";
const initModels = (db) => {
  const User = initModelUser(db);
  const Room = initModelRoom(db);
  const Participant = initModelParticipant(db);
  const LastKnowSessionUser = initModelLastKnownSessionUser(db);
};

export default initModels;
