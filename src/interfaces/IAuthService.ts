import { IUser } from "./IUser";

export interface IAuthService {
  login(
    email: string,
    password: string
  ): Promise<{ token: string; user: any } | null>;
  register(user: IUser): Promise<{ message: string; email: string }>;
  googleLogin(
    googleToken: string
  ): Promise<{ token: string; user: any } | null>;
  userVerification(token: string): Promise<string>;
  logout(email: string, token: string): Promise<string>;
  resetPassword(email: string): Promise<string>;
  updatePassword(token: string, password: string): Promise<string>;
  reSendVerificationToken(email: string): Promise<string>;
}
