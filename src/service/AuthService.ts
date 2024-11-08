import { IAuthService } from "@/interfaces/IAuthService";
import { IUser } from "@/interfaces/IUser";
import { IUserRepository } from "@/interfaces/IUserRepository";
import { compareEncryption, encryption } from "@/utils/encrypt";
import {
  AUTH_JWT_EXPIRE,
  GOOGLE_CLIENT_ID,
  JWT_SECRET_KEY,
  VERIFICATION_JWT_EXPIRE,
} from "@/utils/variables";
import { OAuth2Client } from "google-auth-library";
import jwt, { JwtPayload } from "jsonwebtoken";
import { emailSender } from "./emailService";
import { emailTemplate } from "@/utils/emailTemplate";

export class AuthService implements IAuthService {
  private userRepository: IUserRepository;
  private googleClient: OAuth2Client;
  constructor(userRepository: IUserRepository, googleClient: OAuth2Client) {
    this.userRepository = userRepository;
    this.googleClient = googleClient;
  }
  public async login(
    email: string,
    password: string
  ): Promise<{ token: string; user: any } | null> {
    const user = await this.userRepository.findByEmail(email.toLowerCase());
    if (!user) {
      throw new Error("User not found");
    }
    const isMatch = compareEncryption(password, user.password);
    if (!isMatch) {
      throw new Error("Incorrect password");
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
    await this.userRepository.save(user);
    return { token, user: userDetails };
  }
  public async googleLogin(
    googleToken: string
  ): Promise<{ token: string; user: any } | null> {
    const ticket = await this.googleClient.verifyIdToken({
      idToken: googleToken,
      audience: GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    if (!payload) throw new Error("Invalid Google token");
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

    let user = await this.userRepository.findByEmail(email);
    if (!user) {
      user = await this.userRepository.createUser({
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
    if (user.tokens.length > 3) {
      user.tokens.shift();
    }
    user.tokens.push(token);
    const userDetails = {
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar?.url,
      id: user._id,
      verified: user.verified,
      avatarId: user.avatar?.publicId,
    };
    // console.log(userDetails);
    await this.userRepository.save(user);
    return { token, user: userDetails };
  }
  public async register(user: IUser) {
    const { email, name, password, role } = user;
    const findUser = await this.userRepository.findByEmail(email);
    if (findUser) {
      throw new Error("User already exists");
    }
    const hashPassword = encryption(password);
    const newUser: IUser & { verificationToken: string } = {
      name,
      email,
      password: hashPassword,
      role: role || "user",
      verified: false,
      verificationToken: "",
    };
    const verificationToken = await jwt.sign({ email }, JWT_SECRET_KEY, {
      expiresIn: VERIFICATION_JWT_EXPIRE,
    });
    newUser.verificationToken = verificationToken;
    // await emailSender({
    //   to: email,
    //   subject: "Email verification",
    //   html: emailTemplate({ token: verificationToken, name }),
    // });
    await this.userRepository.createUser(newUser);
    return {
      message: "Verification email sent successfully",
      email: newUser.email,
    };
  }
  public async userVerification(token: string): Promise<string> {
    const decoded = jwt.verify(token, JWT_SECRET_KEY) as JwtPayload;
    const user = await this.userRepository.findById(decoded.id);

    if (!user) {
      throw new Error("User not found");
    }
    if (user.verificationToken !== token) {
      throw new Error("Invalid verification token");
    }
    user.verificationToken = "";
    user.verified = true;
    await user.save();

    return "User verified successfully";
  }
  async logout(email: string, token: string): Promise<string> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new Error("User not found");
    }
    user.tokens = user.tokens.filter((userToken) => userToken !== token);
    await user.save();
    return "Logout successful";
  }
  async resetPassword(email: string): Promise<string> {
    const user = await this.userRepository.findByEmail(email.toLowerCase());
    if (!user) {
      throw new Error("User not found");
    }
    const token = await jwt.sign({ id: user._id, email }, JWT_SECRET_KEY, {
      expiresIn: VERIFICATION_JWT_EXPIRE,
    });
    await emailSender({
      to: email,
      subject: "Reset Password",
      html: emailTemplate({ token, title: "Reset Password" }),
    });
    return "Password reset link sent to email";
  }
  public async updatePassword(token: string, password: string) {
    if (!token || !password) {
      throw new Error("Token and password are required");
    }
    const decoded = jwt.verify(token, JWT_SECRET_KEY) as JwtPayload;

    const user = await this.userRepository.findById(decoded.id);
    if (!user) {
      throw new Error("User not found");
    }
    user.password = encryption(password);
    await user.save();
    return "Password reset successfully";
  }
  public async reSendVerificationToken(email: string): Promise<string> {
    const user = await this.userRepository.findByEmail(email.toLowerCase());
    if (!user) {
      throw new Error("User not found");
    }
    if (user.verified) {
      throw new Error("User already verified");
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
    return "Verification email sent successfully";
  }
}
