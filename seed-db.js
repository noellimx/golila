import sequelize from "./server/database/index.js";

import { hashPassword } from "./server/auth/crypt.js";
const { user: User, room: Room , participant: Participant} = sequelize.models;

import { getUserByUsername } from "./server/database/api/user.js";

const wipe = async () => {
  await User.truncate({ cascade: true });
  await Room.truncate({ cascade: true });
  await Participant.truncate({ cascade: true });
}

const tearDown = async (teardown) => {

  if (teardown){
    await wipe()
  }
  sequelize.close();
}

const seed = async(teardown=true) => {

  try {
    // remove all records

    await wipe()
    const user1Created = await User.create({
      username: "user",
      password: hashPassword("user"),
    });

    const user1Retrieved = await getUserByUsername("user");

    if (user1Retrieved.getDataValue("id") !== user1Created.getDataValue("id")) {
      throw new Error("[seed] user mismatch");
    }
    const idUser1 = user1Created.getDataValue("id");
    const room1 = await Room.create({
      name: "room-abc",
      creatorId: idUser1,
    });

    const idRoom1 = room1.getDataValue("id")

    await Participant.create({
      participantId: idUser1,
      roomId: idRoom1,
      teamNo: 1,
    })


  } catch (err) {
    await tearDown()
    console.log(err);
    throw err;
  }

  await tearDown(teardown)



}

await seed()

export default seed;