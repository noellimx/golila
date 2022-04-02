import { getUserByUsername } from "../database/api/user.js";
import { hashPassword, UserDoor } from "./crypt.js";

const newSecurityToken = (userId) => ({ securityToken: userId });
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

  const exposed_user_id = isMatch ? UserDoor.conceal(`${user_id}`) : null;
  const securityToken = newSecurityToken(exposed_user_id);
  return {
    securityToken,
    msg: isMatch ? "ok" : "Credentials mismatch.",
  };
};
const decodeUserId = (concealed) => UserDoor.reveal(concealed);

const useIdOfToken = (token) => token;
const validateToken = (token) => {
  if (!token) {
    return {
      securityToken: null,
      msg: "Server did not receive target token to verify",
    };
  }
  const userId = useIdOfToken(token);
  const id = decodeUserId(userId);

  // TODO #asdfk124avdsfv verify id....
  console.log(`[validateToken] id is ${id}`);
  return {
    securityToken: token,
    msg: "Verified.",
  };
};

export { getSecurityToken, validateToken, decodeUserId };
