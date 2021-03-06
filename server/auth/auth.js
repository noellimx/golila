import { getUserByUsername, isUserExisting } from "../database/api/user.js";
import { hashPassword, UserDoor } from "./crypt.js";

const newSecurityToken = (userId, msg) => ({ securityToken: userId, msg });
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
  const msg = isMatch ? "ok" : "Credentials mismatch.";
  const securityToken = newSecurityToken(exposed_user_id, msg);
  return securityToken;
};
const decodeUserId = (concealed) => UserDoor.reveal(concealed);

const useIdOfToken = (token) => token;
const validateToken = async (token) => {
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
  const is = await isUserExisting(id);
  if (is) {
    return {
      securityToken: token,
      msg: "Verified.",
    };
  } else {
    return {
      securityToken: null,
      msg: "Token failed verification.",
    };
  }
};

export { getSecurityToken, validateToken, decodeUserId };
