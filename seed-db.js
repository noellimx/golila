import sequelize from "./server/database/index.js";

import { hashPassword } from "./server/auth/crypt.js";
const { user: User, room: Room } = sequelize.models;

import { getUserByUsername } from "./server/database/api/user.js";
try {
  // remove all records
   await User.truncate({ cascade: true });
  await Room.truncate({ cascade: true });


  const user1Created = await User.create({
    username: "user",
    password: hashPassword("user"),
  });

  const user1Retrieved = await getUserByUsername("user");

  if (user1Retrieved.getDataValue("id") !== user1Created.getDataValue("id")){
    throw new Error("[seed] user mismatch")
  }

  await Room.create({
    name: "room-abc",
    creatorId: user1Created.getDataValue("id"),
  });

} catch (err) {
  console.log(err);
  throw err;
}

sequelize.close();
