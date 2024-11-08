import { GOOGLE_CLIENT_ID } from "@/utils/variables";
import { OAuth2Client } from "google-auth-library";

export const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);
