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

const createUser: RequestHandler = async (req: CreateUserRequest, res) => {
  try {
    const { name, email, password, isAdmin = false } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const user = await User.findOne({ email });
    if (user) {
      return res.status(409).json({ message: "User already exists" });
    }
    const hashPassword = encryption(password);
    const newUser = new User({
      name,
      email,
      password: hashPassword,
      role: isAdmin ? "admin" : "user",
    });

    const token = await jwt.sign({ id: newUser._id, email }, JWT_SECRET_KEY, {
      expiresIn: AUTH_JWT_EXPIRE,
    });

    const verificationToken = await jwt.sign(
      { id: newUser._id, email },
      JWT_SECRET_KEY,
      {
        expiresIn: VERIFICATION_JWT_EXPIRE,
      }
    );
    // auth tokens
    newUser.tokens.push(token);

    // email verification token need to implement
    newUser.verificationToken = verificationToken;
    await emailSender({
      to: email,
      subject: "Email verification",
      html: emailTemplate({ token: verificationToken, name }),
    });

    await newUser.save();
    res.status(201).json({ message: "User created successfully", token });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error });
  }
};

const userVerification: RequestHandler = async (req, res) => {
  try {
    const { token } = req.params;

    const decoded = jwt.verify(token, JWT_SECRET_KEY) as JwtPayload;
    const user = await User.findOne({
      _id: decoded.id,
      verificationToken: token,
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.verificationToken = "";
    user.verified = true;
    await user.save();

    res.status(200).json({ message: "User verified successfully" });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error });
  }
};

const login: RequestHandler = async (req, res) => {
  try {
    const { email, password } = req.body as { email: string; password: string };

    const user = await User.findOne({ email: email.toLowerCase() });
    console.log(email);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // if (!user.verified) {
    //   return res.status(401).json({ message: "Please verify your account" });
    // }
    const isMatch = compareEncryption(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Password is incorrect" });
    }

    const token = await jwt.sign({ id: user._id, email }, JWT_SECRET_KEY, {
      expiresIn: AUTH_JWT_EXPIRE,
    });
    const userDetails = {
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar?.url,
      id: user._id,
      verified: user.verified,
      avatarId: user.avatar?.publicId,
    };
    if (user.tokens.length > 3) {
      user.tokens.shift();
    }
    user.tokens.push(token);
    await user.save();
    res
      .status(200)
      .json({ message: "Login successful", token, user: userDetails });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error });
  }
};

const logout: RequestHandler = async (req, res) => {
  try {
    const email = req.user?.email;
    const token = req.token;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.tokens = user.tokens.filter((userToken) => userToken !== token);
    await user.save();
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error });
  }
};
// should implement opt based  email verification?

const resetPassword: RequestHandler = async (req, res) => {
  try {
    const { email } = req.body as { email: string };
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const token = await jwt.sign({ id: user._id, email }, JWT_SECRET_KEY, {
      expiresIn: VERIFICATION_JWT_EXPIRE,
    });
    await emailSender({
      to: email,
      subject: "Reset Password",
      html: emailTemplate({ token, title: "Reset Password" }),
    });
    res.status(200).json({ message: "Password reset link sent to email" });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error });
  }
};
const updatePassword: RequestHandler = async (req, res) => {
  try {
    const { token, password } = req.body;
    if (!token || !password) {
      return res
        .status(400)
        .json({ message: "Please provide token and password" });
    }
    const decoded = jwt.verify(token, JWT_SECRET_KEY) as JwtPayload;

    const user = await User.findOne({ _id: decoded.id });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.password = encryption(password);
    await user.save();
    res.status(201).json({ message: "Password reset successfully" });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error });
  }
};
const reSendVerificationToken: RequestHandler = async (req, res) => {
  try {
    const { email } = req.body as { email: string };
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.verified) {
      return res.status(400).json({ message: "User already verified" });
    }
    const verificationToken = await jwt.sign(
      { id: user._id, email },
      JWT_SECRET_KEY,
      {
        expiresIn: VERIFICATION_JWT_EXPIRE,
      }
    );
    user.verificationToken = verificationToken;
    await user.save();
    await emailSender({
      to: email,
      subject: "Email verification",
      html: emailTemplate({ token: verificationToken, name: user.name }),
    });
    res.status(200).json({ message: "Verification email sent successfully" });
  } catch (error) {}
};
export {
  logout,
  createUser,
  userVerification,
  login,
  resetPassword,
  reSendVerificationToken,
  updatePassword,
};
