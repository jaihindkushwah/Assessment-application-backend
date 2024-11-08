import { IUser } from "@/interfaces/IUser";
import { IUserRepository } from "@/interfaces/IUserRepository";
import User, { UserDocument } from "@/models/User";

export class UserRepository implements IUserRepository {
  public async createUser(user: IUser): Promise<UserDocument> {
    const newUser = new User(user);
    return newUser.save();
  }
  public async findByEmail(email: string): Promise<UserDocument | null> {
    return await User.findOne({ email }).exec();
  }
  public async findById(id: string) {
    return null;
  }
  public async updateUser(user: IUser) {
    return user;
  }
  public async save(user: UserDocument): Promise<void> {
    await user.save();
  }
}
