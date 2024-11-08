import { UserDocument } from "@/models/User";
import { IUser } from "./IUser";

export interface IUserRepository {
  createUser: (user: IUser) => Promise<UserDocument>;
  findByEmail: (email: string) => Promise<UserDocument | null>;
  findById: (id: string) => Promise<UserDocument | null>;
  updateUser: (user: IUser) => Promise<IUser | null>;
  save: (user: UserDocument) => Promise<void>;
}
