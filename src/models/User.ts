import { Model, model, Schema } from "mongoose";

export interface UserDocument {
  name: string;
  email: string;
  password: string;
  verified: boolean;
  avatar?: { url: string; publicId: string };
  tokens: string[];
  role: "user" | "admin";
  verificationToken: string;
}

const userSchema = new Schema<UserDocument>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      transform: (email: string) => email.toLowerCase(),
    },
    password: {
      type: String,
      required: true,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    avatar: {
      type: Object,
      url: String,
      publicId: String,
    },
    role: {
      type: String,
      default: "user",
    },
    tokens: [String],
    verificationToken: {
      type: String,
    },
  },
  { timestamps: true }
);

const User = model("User", userSchema) as Model<UserDocument>;
export default User;
