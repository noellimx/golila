import crypto from "crypto";

const hashPassword = (plain) =>
  crypto.createHmac("sha256", "password").update(plain).digest("hex");

export { hashPassword };
