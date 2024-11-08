import { Document, Model, model, Schema } from "mongoose";

enum ERoleType {
  User = "user",
  Admin = "admin",
}

export interface UserDocument extends Document {
  name: string;
  email: string;
  password: string;
  verified: boolean;
  avatar?: { url: string; publicId: string };
  tokens: string[];
  role: ERoleType;
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
      lowercase: true,
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
      default: ERoleType.User,
      enum: Object.values(ERoleType),
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
