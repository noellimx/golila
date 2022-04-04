import sequelize from "../index.js";
import crypto from "crypto";
const Room = sequelize.models.room;
const Participant = sequelize.models.participant;

const DEFAULT_TEAM_NO = 1;

const createRoom = async ({ name, creatorId }) => {
  console.log(`[createRoom] room name: ${name} creator: ${creatorId}`);
  if (name === "") {
    name = crypto.randomUUID().slice(5);
  }
  return Room.create({
    name,
    creatorId,
  });
};

/**
 *
 * @returns {Promise<Boolean>}
 */
const moveParticipantIntoRoom = async ({ participantId, teamNo, roomId }) => {
  return Participant.upsert({ participantId, teamNo, roomId });
};

const whichRoomIsUserIn = async (participantId) => {
  const p = await Participant.findOne({
    where: { participantId },
    attributes: ["roomId"],
  });
  return p ? p.getDataValue("roomId") : null;
};

const createAndJoinRoom = async (userId, roomName) => {
  // userId should be plain since caller is server.

  const room = await createRoom({ creatorId: userId, name: roomName });

  const roomId = room.getDataValue("id");
  const participantId = userId;
  await moveParticipantIntoRoom({
    participantId,
    teamNo: DEFAULT_TEAM_NO,
    roomId,
  });

  const participantIsInRoom = await whichRoomIsUserIn(participantId);

  console.log(`[participantIsInRoom] in room ${participantIsInRoom}`);
  return participantIsInRoom;
};

export { createAndJoinRoom, whichRoomIsUserIn };
