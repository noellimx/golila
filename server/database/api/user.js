import sequelize from "../../database/index.js";

const { user: User } = sequelize.models;

const getUserByUsername = async (username) =>
  await User.findOne({ where: { username } });
const getUserById = async (id) => await User.findOne({ where: { id } });

const isUserExisting = async (id) => {
  const user = await getUserById(id);
  console.log(`[isUserExisting] is? ${!!user}`);
  return user;
};
export { getUserByUsername, isUserExisting };
