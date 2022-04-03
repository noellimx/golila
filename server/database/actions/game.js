import sequelize from "../index.js";

const Room = sequelize.models.room;


const DEFAULT_TEAM_NO = 1

const createRoom = async ({ name, creatorId}) => {
  return Room.create({
    name, creatorId
  })
};

const addParticipantIntoRoom = () => {};
const createAndJoinRoom = async (userId,roomName) => {
    // userId should be plain since caller is server.

  const room = await createRoom({creatorId: userId, name: roomName});

  const roomId = room.getDataValue("id");

  await addParticipantIntoRoom({ userId, teamNo: DEFAULT_TEAM_NO, roomId
})

return roomId
};

export {
  createAndJoinRoom

}