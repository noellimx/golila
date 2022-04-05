import sequelize from "../index.js";
import { UserDoor } from "../../auth/crypt.js";

import { getSocketsOfUsers } from "../api/session.js";

import {
  getRandomChain,
  chainToString,
  stringToChain,
} from "../../app/chain.js";

const {
  room: Room,
  participant: Participant,
  user: User,
  gameplay: Gameplay,
} = sequelize.models;
const DEFAULT_TEAM_NO = 1;
const createRoom = async ({ name, creatorId }) => {
  console.log(`[createRoom] room name: ${name} creator: ${creatorId}`);
  if (name === "") {
    throw new Error("Room name must have > 1 character.");
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

const participantsOfRoom = async (roomId, conceal = true) => {
  return await Participant.findAll({ where: { roomId } }).then(
    async (rooms) => {
      const result = Promise.all(
        rooms.map(async ({ dataValues }) => {
          const { participantId, roomId } = dataValues;

          const participantName = await getUserNameById(participantId);

          return {
            participantId: conceal
              ? UserDoor.conceal(`${participantId}`)
              : participantId,
            roomId,
            participantName,
          };
        })
      );

      return result;
    }
  );
};

const participantIdsOfRoom = async (roomId, conceal = true) => {
  const ps = await participantsOfRoom(roomId, conceal);
  const pids = ps.map(({ participantId }) => participantId);
  return pids;
};
const removeParticipantsOfRoom = async (roomId) => {
  console.log(`[removeParticipantsOfRoom]`);

  const pids = await participantIdsOfRoom(roomId, false);

  await Participant.destroy({
    where: {
      participantId: pids,
    },
  });

  return pids;
};

const joinRoom = async (userId, roomId) => {
  // userId should be plain since caller is server.
  console.log(`[Server joinRoom] attempting... roomid ${roomId}`);
  try {
    const participantId = userId;
    await moveParticipantIntoRoom({
      participantId,
      teamNo: DEFAULT_TEAM_NO,
      roomId,
    });

    const participantIsInRoom = await whichRoomIsUserIn(participantId);

    console.log(`[joinRoom] := in room ${participantIsInRoom}`);
    return participantIsInRoom;
  } catch (err) {
    throw err;
  }
};

const createAndJoinRoom = async (userId, roomName) => {
  // userId should be plain since caller is server.
  console.log(`[Server createAndJoinRoom ] attempting... creator ${userId}`);
  try {
    const room = await createRoom({ creatorId: userId, name: roomName });

    const roomId = room.getDataValue("id");
    const participantId = userId;
    await moveParticipantIntoRoom({
      participantId,
      teamNo: DEFAULT_TEAM_NO,
      roomId,
    });

    const participantIsInRoom = await whichRoomIsUserIn(participantId);

    console.log(`[createAndJoinRoom] := in room ${participantIsInRoom}`);
    return participantIsInRoom;
  } catch (err) {
    throw err;
  }
};

const getLineUp = async (id, conceal = true) => {
  console.log(`[getLineUp] ${id}`);
  const roomId = await whichRoomIsUserIn(id);
  if (!roomId) {
    return null;
  }
  const lineup = await Participant.findAll({
    where: { roomId },
    attributes: ["participantId", "teamNo"],
    include: User,
  });

  const result = lineup.map((p) => {
    console.log(p);
    const _pid = p.getDataValue("participantId");
    const participantId = conceal ? UserDoor.conceal(_pid) : _pid;
    const teamNo = p.getDataValue("teamNo");

    const participantName = p.getDataValue("user").username;

    return {
      participantId,
      teamNo,
      participantName,
    };
  });
  return [roomId, result];
};

// leaves room and if user is creator, delete room

const leaveRoom = async (userId) => {
  console.log(`[leaveRoom]`);
  const participant = await Participant.findOne({
    where: { participantId: userId },
  });

  if (!participant) {
    return [null, [], null];
  }
  const fromRoomId = participant.getDataValue("roomId");
  const participantId = participant.getDataValue("participantId");

  const roomDetails = await Room.findOne({ where: { id: fromRoomId } });

  const creatorId = roomDetails.getDataValue("creatorId");
  // op
  console.log(`[leaveRoom] ${participantId}`);

  if (participantId === creatorId) {
    const pids = await removeParticipantsOfRoom(fromRoomId);

    await Room.destroy({ where: { id: fromRoomId } });

    return [fromRoomId, pids, true];
  } else {
    const pids = await participantIdsOfRoom(fromRoomId, false);

    await Participant.destroy({ where: { participantId } });
    return [fromRoomId, pids, false];
  }
};

const checkLineUpByUserId = async (userId, conceal = true) => {
  console.log(`[checkLineUpByUserId]`);
  const participant = await Participant.findOne({
    where: { participantId: userId },
  });

  if (!participant) {
    return [null, []];
  }
  const fromRoomId = participant.getDataValue("roomId");

  const pids = await participantIdsOfRoom(fromRoomId, conceal);

  return [fromRoomId, pids];
};

const getUserNameById = async (id) => {
  const user = await User.findOne({ where: { id } });
  return user.getDataValue("username");
};

const getRoomData = async (roomId) => {
  const { dataValues } = await Room.findOne({ where: { id: roomId } });
  const { id, creatorId, name } = dataValues;
  const username = await getUserNameById(creatorId);
  return {
    id,
    creatorId: UserDoor.conceal(`${creatorId}`),
    name,
    creatorName: username,
  };
};
const getAllRooms = async () => {
  return await Room.findAll().then(async (rooms) => {
    const result = Promise.all(
      rooms.map(async ({ dataValues }) => {
        const { id, creatorId, name } = dataValues;

        const username = await getUserNameById(creatorId);

        return {
          id,
          creatorId: UserDoor.conceal(`${creatorId}`),
          name,
          creatorName: username,
        };
      })
    );

    return result;
  });
};

const changeTeam = async (participantId) => {
  console.log(`[changeTeam]`);
  await Participant.findOne({ where: { participantId } }).then((p) => {
    console.log(`[changeTeam] found participant`);
    console.log(p);

    const teamNo = Number(p.getDataValue("teamNo")) === 1 ? 2 : 1;
    p.update({ teamNo });
  });

  const roomId = await whichRoomIsUserIn(participantId);
  if (!roomId) {
    return [];
  }
  const pids = await participantIdsOfRoom(roomId, false);
  return pids;
};

// this works for now since user is creator of at most 1 room at any one time for now
const isUserSomeCreator = async (userId) => {
  const some = await Room.findOne({ where: { creatorId: userId } });

  return [!!some, some?.getDataValue("id")]; // predicate and room id
};

const getSocketsOfRoomByParticipatingUserId = async (userId) => {
  const roomId = await whichRoomIsUserIn(userId);
  const lineupIds = await participantIdsOfRoom(roomId, false);
  const userSockets = await getSocketsOfUsers(lineupIds);

  return userSockets;
};

const initGameplay = async (userId) => {
  try {
    const roomId = await whichRoomIsUserIn(userId);
    const now = new Date();
    const firstchain = chainToString(getRandomChain());
    await Gameplay.create({ roomId, chain: firstchain, endDate: now });
  } catch {}
};

const getChainOfGameplayForUser = async (userId) => {
  try {
    const roomId = await whichRoomIsUserIn(userId);
    const game = await Gameplay.findOne({ where: { roomId } });
    if (!game) {
      return null;
    }
    const chainString = game.getDataValue("chain");

    console.log(`[getChainOfGameplayForUser] ${chainString}`);
    return stringToChain(chainString);
  } catch (err) {
    return null;
  }
};
export {
  createAndJoinRoom,
  whichRoomIsUserIn,
  getLineUp,
  leaveRoom,
  getAllRooms,
  getRoomData,
  joinRoom,
  checkLineUpByUserId,
  changeTeam,
  participantsOfRoom,
  isUserSomeCreator,
  getSocketsOfRoomByParticipatingUserId,
  initGameplay,
  getChainOfGameplayForUser,
};
