import User from "@/models/User";
import { JWT_SECRET_KEY } from "@/utils/variables";
import { RequestHandler } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

export const isUserVerified: RequestHandler = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (!user.verified) {
      return res.status(401).json({ message: "Please verify your account" });
    }
    next();
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

export const isAuthorized: RequestHandler = async (req, res, next) => {
  const { authorization } = req.headers;
  const token = authorization?.split("Bearer ")[1];
  if (!token) {
    return res.status(403).json({ error: "Unauthorized request" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET_KEY) as JwtPayload;
    const id = decoded.id;
    const user = await User.findOne({ _id: id, tokens: token });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    req.user = {
      id: user._id,
      email: user.email,
      avatar: user.avatar?.url,
      verified: user.verified,
      name: user.name,
    };
    req.token = token;
    next();
  } catch (error) {
    res.status(500).json({ error: error });
  }
};
