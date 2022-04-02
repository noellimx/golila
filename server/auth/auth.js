import { getUserByUsername } from "../database/api/user.js";
import { hashPassword, UserDoor } from "./crypt.js";

const getSecurityToken = async ({ username, password: clearPassword }) => {
  if (!username) {
    return {
      securityToken: null,
      msg: "User field should not be empty :(",
    };
  }
  const details = await getUserByUsername(username);
  if (!details) {
    return {
      securityToken: null,
      msg: "User not found.",
    };
  }
  const passwordReceivedHashed = hashPassword(clearPassword);
  const passwordDatabaseHashed = details.getDataValue("password");

  const user_id = details.getDataValue("id");
  const isMatch = passwordReceivedHashed === passwordDatabaseHashed;
  const securityToken = isMatch ? UserDoor.conceal(`${user_id}`) : null;
  return {
    securityToken,
    msg: isMatch ? "ok" : "Credentials mismatch.",
  };
};

const validateToken = (token) => {
  if (!token) {
    return {
      securityToken: null,
      msg: "Server did not receive target token to verify",
    };
  }

  const id = UserDoor.reveal(token);
  console.log(`[validateToken] id is ${id}`);
  return {
    securityToken: token,
    msg: "Server did not receive target token to verify",
  };
};

export { getSecurityToken, validateToken };
