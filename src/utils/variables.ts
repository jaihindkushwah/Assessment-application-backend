import { config } from "dotenv";
config();

const { env } = process as { env: { [key: string]: string } };

export const MONGO_URI = env.MONGO_URI;
export const PORT = env.PORT;
export const JWT_SECRET_KEY = env.JWT_SECRET_KEY;
export const MAIL_USERNAME = env.MAIL_USERNAME;
export const MAIL_PASSWORD = env.MAIL_PASSWORD;
export const MAIL_ID = env.MAIL_ID;
export const AUTH_JWT_EXPIRE = env.AUTH_JWT_EXPIRE;
export const VERIFICATION_JWT_EXPIRE = env.VERIFICATION_JWT_EXPIRE;
export const AUTH_BASE_URL = env.AUTH_BASE_URL;
export const GOOGLE_CLIENT_ID = env.GOOGLE_ID;
