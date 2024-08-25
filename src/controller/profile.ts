import { ProfilePic } from "@/@types/profile";
import User from "@/models/User";
import { RequestHandler } from "express";

export const updateProfilePic: RequestHandler = async (
  req: ProfilePic,
  res
) => {
  try {
    const user = req.user;
    const { publicId, avatarUrl } = req.body;
    if (!user) {
      return res.status(400).json({ message: "Please provide user" });
    }
    await User.findByIdAndUpdate(user.id, {
      avatar: { url: avatarUrl, publicId },
    });
    res.status(200).json({
      message: "Profile pic updated successfully",
      avatar: { url: avatarUrl, publicId },
    });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

export const updateProfile: RequestHandler = async (req, res) => {
  try {
  } catch (error) {}
};
