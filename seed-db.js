import sequelize from "./server/database/index.js";

import { hashPassword } from "./server/auth/crypt.js";
const { user: User, room: Room } = sequelize.models;

import { getUserByUsername } from "./server/database/api/user.js";
try {
  // remove all records
  const s = await User.truncate({ cascade: true });
  const ss = await User.create({
    username: "user",
    password: hashPassword("user"),
  });

  const sss = await getUserByUsername("user");

  console.log(sss)

 try {
   await Room.create({
     name: "room-abc", creatorId: sss.dataValues.id
   })
   console.log("Room seed ok")
 }catch (err){
    console.log("[seed] Room failure")

 }
} catch (err) {
  console.log(err);
}

sequelize.close();
