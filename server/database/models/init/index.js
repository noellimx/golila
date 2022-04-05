import initModelUser from "./user.js";
import initModelRoom from "./room.js";
import initModelParticipant from "./participant.js";
import initModelLastKnownSessionUser from "./lastKnownSessionUser.js";
import initModeGameplay from "./gameplay.js";
const initModels = (db) => {
  const User = initModelUser(db);
  const Room = initModelRoom(db);
  const Participant = initModelParticipant(db);
  const LastKnowSessionUser = initModelLastKnownSessionUser(db);
  const Gameplay = initModeGameplay(db);
  Participant.belongsTo(User, { foreignKey: "participantId" });
};

export default initModels;
