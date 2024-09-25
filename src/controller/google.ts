import { CreateUserRequest } from "@/@types/user";
import User from "@/models/User";
import { emailSender } from "@/service/emailService";
import { emailTemplate } from "@/service/emailTemplate";
import { compareEncryption, encryption } from "@/utils/encrypt";
import {
  AUTH_JWT_EXPIRE,
  JWT_SECRET_KEY,
  VERIFICATION_JWT_EXPIRE,
} from "@/utils/variables";
import { RequestHandler } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
const GOOGLE_CLIENT_ID = process.env.GOOGLE_ID;
const client = new OAuth2Client(GOOGLE_CLIENT_ID);

export const googleLogin: RequestHandler = async (req, res) => {
  const { googleToken } = req.body;
  // console.log(GOOGLE_CLIENT_ID);

  try {
    const ticket = await client.verifyIdToken({
      idToken: googleToken,
      audience: GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();

    const {
      sub: googleId,
      email,
      name,
      picture,
    } = payload as {
      sub: string;
      email: string;
      name: string;
      picture: string;
    };

    // Check if user exists, if not create a new user
    let user = await User.findOne({ email });
    // console.log("New user created:", user);

    if (!user) {
      user = new User({
        email,
        name,
        avatar: {
          url: picture,
        },
        verified: true,
        password: encryption(googleId),
        role: "user",
      });
    }

    if (!user.verified) {
      user.verified = true;
      user.verificationToken = "";
    }
    if (!user.avatar?.url) {
      user.avatar = {
        url: picture,
        publicId: "",
      };
    }
    const token = await jwt.sign(
      { id: user._id, email: user.email },
      JWT_SECRET_KEY,
      {
        expiresIn: AUTH_JWT_EXPIRE,
      }
    );
    user.tokens.push(token);
    await user.save();

    // console.log(user);
    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        avatar: user.avatar?.url,
        verified: user.verified,
        role: user.role,
        avatarId: user.avatar?.publicId,
      },
    });
  } catch (error) {
    console.error("Error verifying Google token:", error);
    res.status(401).json({ error: "Invalid token" });
  }
};
