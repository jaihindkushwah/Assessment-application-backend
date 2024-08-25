import { updateProfilePic } from "@/controller/profile";
import { isAuthorized } from "@/middleware/auth";
import { validator } from "@/middleware/validator";
import { UpdateProfilePic } from "@/utils/validationSchema";
import { Router } from "express";

const router = Router();

router.patch(
  "/update-profile-pic",
  validator(UpdateProfilePic),
  isAuthorized,
  updateProfilePic
);

export default router;
