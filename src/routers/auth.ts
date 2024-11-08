import { AuthController } from "@/controller/AuthController";
// import { googleLogin } from "@/controller/google";
// // import AuthController from "@/controller/auth";
// import { isAuthorized, isUserVerified } from "@/middleware/auth";
import { validator } from "@/middleware/validator";
import { UserRepository } from "@/repositories/UserRepository";
import { AuthService } from "@/service/AuthService";
import { Request, Response } from "express";
import {
  CreateUserSchema,
  LoginSchema,
  VerificationSchema,
} from "@/utils/validationSchema";
import { Router } from "express";
import { googleClient } from "@/config/googleClient";

const router = Router();

// const authController = new AuthController();
const userRepository = new UserRepository();
const authService = new AuthService(userRepository, googleClient);
const authController = new AuthController(authService);

router.post("/login", validator(LoginSchema), (req, res) =>
  authController.login(req, res)
);

router.post(
  "/register",
  validator(CreateUserSchema),
  (req: Request, res: Response) => authController.register(req, res)
);
router.post("/google", (req, res) => authController.googleLogin(req, res));


// router.get("/verify/:token", authController.userVerification);
// // isUserVerified,
// router.post(
//   "/reset-password",
//   validator(VerificationSchema),
//   authController.resetPassword
// );
// router.post(
//   "/re-send-verification-token",
//   validator(VerificationSchema),
//   authController.reSendVerificationToken
// );
// router.post(
//   "/update-password",
//   validator(CreateUserSchema),
//   authController.updatePassword
// );
// router.get("/logout", isAuthorized, authController.logout);
export default router;
