import { googleLogin } from "@/controller/google";
import {
  createUser,
  login,
  reSendVerificationToken,
  resetPassword,
  userVerification,
  logout,
  updatePassword,
} from "@/controller/user";
import { isAuthorized, isUserVerified } from "@/middleware/auth";
import { validator } from "@/middleware/validator";
import {
  CreateUserSchema,
  LoginSchema,
  VerificationSchema,
} from "@/utils/validationSchema";
import { Router } from "express";

const router = Router();

router.post("/google", googleLogin);
router.post("/register", validator(CreateUserSchema), createUser);
router.get("/verify/:token", userVerification);
// isUserVerified,
router.post("/login", validator(LoginSchema), login);
router.post("/reset-password", validator(VerificationSchema), resetPassword);
router.post(
  "/re-send-verification-token",
  validator(VerificationSchema),
  reSendVerificationToken
);
router.post("/update-password", validator(CreateUserSchema), updatePassword);
router.get("/logout", isAuthorized, logout);
export default router;
