import { CreateUserRequest, GoogleLogin, LoginUser } from "@/@types/auth";
import { IAuthService } from "@/interfaces/IAuthService";
import { Request, Response } from "express";

export class AuthController {
  private authService: IAuthService;
  constructor(authService: IAuthService) {
    this.authService = authService;
  }
  public async login(req: LoginUser, res: Response) {
    try {
      const { email, password } = req.body;
      const user = await this.authService.login(email, password);
      res.status(200).json({ token: user?.token, user: user?.user });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      }
    }
  }
  public async register(req: CreateUserRequest, res: Response): Promise<void> {
    try {
      const { name, email, password, isAdmin = false } = req.body;
      if (!name || !email || !password) {
        res.status(400).json({ message: "All fields are required" });
        return;
      }
      const newUser = await this.authService.register({
        name,
        email,
        password,
        role: isAdmin ? "admin" : "user",
      });
      res.status(201).json({ message: newUser.message, user: newUser.email });
    } catch (error) {
      console.log(error);
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
        return;
      }
    }
  }
  public async googleLogin(req: GoogleLogin, res: Response) {
    try {
      const { googleToken } = req.body;
      const user = await this.authService.googleLogin(googleToken);
      res.status(200).json({ token: user?.token, user: user?.user });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      }
    }
  }
  public async userVerification(req: Request, res: Response): Promise<void> {
    try {
      await this.authService.userVerification(req.params.token);

      res.status(200).json({ message: "User verified successfully" });
    } catch (error) {
      console.log(error);
      res.status(400).json({ error: error });
    }
  }
  // async logout(req: Request, res: Response): Promise<void> {
  //   try {
  //     const email = req.user?.email;
  //     const token = req.token;
  //     const user = await User.findOne({ email });
  //     if (!user) {
  //       res.status(404).json({ message: "User not found" });
  //       return;
  //     }
  //     user.tokens = user.tokens.filter((userToken) => userToken !== token);
  //     await user.save();
  //     res.status(200).json({ message: "Logout successful" });
  //   } catch (error) {
  //     console.log(error);
  //     res.status(400).json({ error: error });
  //   }
  // }
  // async resetPassword(req: Request, res: Response): Promise<void> {
  //   try {
  //     const { email } = req.body as { email: string };
  //     const user = await User.findOne({ email: email.toLowerCase() });
  //     if (!user) {
  //       res.status(404).json({ message: "User not found" });
  //       return;
  //     }
  //     const token = await jwt.sign({ id: user._id, email }, JWT_SECRET_KEY, {
  //       expiresIn: VERIFICATION_JWT_EXPIRE,
  //     });
  //     await emailSender({
  //       to: email,
  //       subject: "Reset Password",
  //       html: emailTemplate({ token, title: "Reset Password" }),
  //     });
  //     res.status(200).json({ message: "Password reset link sent to email" });
  //   } catch (error) {
  //     console.log(error);
  //     res.status(400).json({ error: error });
  //   }
  // }
  // public async updatePassword(req: Request, res: Response) {
  //   try {
  //     const { token, password } = req.body;
  //     if (!token || !password) {
  //       return res
  //         .status(400)
  //         .json({ message: "Please provide token and password" });
  //     }
  //     const decoded = jwt.verify(token, JWT_SECRET_KEY) as JwtPayload;

  //     const user = await User.findOne({ _id: decoded.id });
  //     if (!user) {
  //       return res.status(404).json({ message: "User not found" });
  //     }
  //     user.password = encryption(password);
  //     await user.save();
  //     res.status(201).json({ message: "Password reset successfully" });
  //   } catch (error) {
  //     console.log(error);
  //     res.status(400).json({ error: error });
  //   }
  // }
  // public async reSendVerificationToken(
  //   req: Request,
  //   res: Response
  // ): Promise<void> {
  //   try {
  //     const { email } = req.body as { email: string };
  //     const user = await User.findOne({ email: email.toLowerCase() });
  //     if (!user) {
  //       res.status(404).json({ message: "User not found" });
  //       return;
  //     }
  //     if (user.verified) {
  //       res.status(400).json({ message: "User already verified" });
  //       return;
  //     }
  //     const verificationToken = await jwt.sign(
  //       { id: user._id, email },
  //       JWT_SECRET_KEY,
  //       {
  //         expiresIn: VERIFICATION_JWT_EXPIRE,
  //       }
  //     );
  //     user.verificationToken = verificationToken;
  //     await user.save();
  //     await emailSender({
  //       to: email,
  //       subject: "Email verification",
  //       html: emailTemplate({ token: verificationToken, name: user.name }),
  //     });
  //     res.status(200).json({ message: "Verification email sent successfully" });
  //   } catch (error) {
  //     res.status(400).json({ error: error });
  //   }
  // }
}
