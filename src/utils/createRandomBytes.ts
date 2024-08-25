import { randomBytes } from "crypto";
export const createRandomToken = (length = 16) => {
  return randomBytes(length).toString("hex");
};
