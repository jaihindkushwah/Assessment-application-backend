import { CreateUserRequest } from "@/@types/user";
import User from "@/models/User";
import { RequestHandler } from "express";

const createUser: RequestHandler = async (req: CreateUserRequest, res) => {
  try {
    const { name, email, password } = req.body;

    const user = new User({ name, email, password });
    await user.save();
    res.status(201).json({ name, email, password });
  } catch (error) {
    res.status(400).send(error);
  }
};

export { createUser };
