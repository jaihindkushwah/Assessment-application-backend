import {
  createProblem,
  getAllProblem,
  getProblemById,
} from "@/controller/dsaproblems";
import { isAuthorized } from "@/middleware/auth";
import { validator } from "@/middleware/validator";
import { DsaProblemSchema } from "@/utils/validationSchema";
import { Router } from "express";

const router = Router();

router.post(
  "/create",
  isAuthorized,
  validator(DsaProblemSchema),
  createProblem
);
router.get("/get/:id", getProblemById);
router.get("/getAll", isAuthorized, getAllProblem);

export default router;
