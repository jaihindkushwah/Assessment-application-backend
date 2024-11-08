export interface IUser {
  id?: string;
  name: string;
  email: string;
  verified?: boolean;
  password: string;
  avatar?: { url?: string; publicId?: string };
  role?: "user" | "admin";
}
