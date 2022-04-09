import crypto from "crypto";

const hashPassword = (plain) =>
  crypto.createHmac("sha256", "password").update(plain).digest("hex");

const KEY_USER_DOOR = "d6F3Efeq";
const ALGO_USER_DOOR = "aes-256-cbc";
const IV_USER_DOOR = "692e44dbbea073fc1a8d1c37ea68dffa";
const getUserDoor = (algo, key, iv) => {
  // TODO use IV
  const cipher = () => crypto.createCipher(algo, key);
  const decipher = () => crypto.createDecipher(algo, key);

  return {
    conceal: (username) => {
      username = `${username}`;
      const c = cipher();
      c.update(username, "utf-8", "hex");
      return c.final("hex");
    },
    reveal: (concealed) => {
      concealed = `${concealed}`;
      const d = decipher();
      d.update(concealed, "hex", "utf-8");
      return d.final("utf-8");
    },
  };
};

const UserDoor = getUserDoor(ALGO_USER_DOOR, KEY_USER_DOOR, IV_USER_DOOR);
export { hashPassword, UserDoor };
