import sequelize from "./server/database/index.js";

import { hashPassword } from "./server/auth/crypt.js";
const { user: User } = sequelize.models;

import { getUserByUsername } from "./server/database/api/user.js";
try {
  // remove all records
  const s = await User.destroy({ truncate: true });
  const ss = await User.create({
    username: "user",
    password: hashPassword("user"),
  });

  const sss = await getUserByUsername("user");
  console.log(sss.getDataValue("password"));

  console.log(sss);
} catch (err) {
  console.log(err);
}

sequelize.close();
