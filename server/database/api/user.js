import sequelize from "../../database/index.js";

const { user: User } = sequelize.models;

const getUserByUsername = async (username) =>
  await User.findOne({ where: { username } });

export { getUserByUsername };
