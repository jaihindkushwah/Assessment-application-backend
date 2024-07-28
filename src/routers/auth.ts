import { CreateUserRequest } from "@/@types/user";
import { createUser } from "@/controller/user";
import { validator } from "@/middleware/validator";
import User from "@/models/User";
import { CreateUserSchema } from "@/utils/validationSchema";
import { Router } from "express";

const router = Router();

router.post("/create", validator(CreateUserSchema), createUser);

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
  } catch (error) {}
});

export default router;
