import sequelize from "../../database/index.js";
import { hashPassword } from "../../auth/crypt.js";
const { user: User } = sequelize.models;

const getUserByUsername = async (username) =>
  await User.findOne({ where: { username } });
const getUserById = async (id) => await User.findOne({ where: { id } });

const isUserExisting = async (id) => {
  const user = await getUserById(id);
  console.log(`[isUserExisting] is? ${!!user}`);
  return user;
};

const isUserExistingByUsername = async (username) =>
  !!(await getUserByUsername(username));

const createUser = async (username, password) => {
  const user = await User.create({
    username,
    password: hashPassword(password),
  });

  return user;
};
export {
  getUserByUsername,
  isUserExisting,
  isUserExistingByUsername,
  createUser,
};
