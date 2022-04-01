import sequelize from "./server/database/index.js";

import { hashPassword } from "./server/auth/index.js";
const { user: User } = sequelize.models;

try {
  // remove all records
  const s = await User.destroy({ truncate: true });
  const ss = await User.create({
    username: "user",
    password: hashPassword("user"),
  });
} catch (err) {
  console.log(err);
}

sequelize.close()
