import sequelize from "../index.js";

import { hashPassword } from "../../auth/crypt.js";

import { getUserByUsername } from "../api/user.js";
import crypto from "crypto";

const {
  user: User,
  room: Room,
  participant: Participant,
  gameplay: Gameplay,
} = sequelize.models;

const wipe = async () => {
  await User.truncate({ cascade: true });
  await Room.truncate({ cascade: true });
  await Participant.truncate({ cascade: true });
  await Gameplay.truncate({ cascade: true });
};

const tearDown = async () => {
  await wipe();
  sequelize.close();
};

const seed = async () => {
  await wipe();

  const user = await User.create({
    username: "user",
    password: hashPassword("user"),
  });

  await User.create({
    username: "user2",
    password: hashPassword("user"),
  });
  const idUser1 = user.getDataValue("id");

  const room1 = await Room.create({
    name: "room-abc" + crypto.randomUUID(),
    creatorId: idUser1,
  });

  const idRoom1 = room1.getDataValue("id");

  await Participant.create({
    participantId: idUser1,
    roomId: idRoom1,
    teamNo: 1,
  });
};
const seedTest = async () => {
  try {
    await wipe();

    await User.create({
      username: "user",
      password: hashPassword("user"),
    });

    const userRetrieved = await getUserByUsername("user");

    const user1Created = await User.create({
      username: "user" + crypto.randomUUID(),
      password: hashPassword("user"),
    });

    const idUser1 = user1Created.getDataValue("id");
    const room1 = await Room.create({
      name: "room-abc" + crypto.randomUUID(),
      creatorId: idUser1,
    });

    const idRoom1 = room1.getDataValue("id");

    await Participant.create({
      participantId: idUser1,
      roomId: idRoom1,
      teamNo: 1,
    });
  } catch (err) {
    await tearDown();
    console.log(err);
    throw err;
  }
  await tearDown();
};
export { seedTest, seed };
