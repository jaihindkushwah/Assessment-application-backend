import { createProblem } from "@/controller/dsaproblems";
import { ProblemController } from "@/controller/ProblemController";
import { isAuthorized } from "@/middleware/auth";
import { validator } from "@/middleware/validator";
import { ProblemRepository } from "@/repositories/ProblemRepository";
import { ProblemService } from "@/service/ProblemService";
import { DsaProblemSchema } from "@/utils/validationSchema";
import { Router } from "express";

const router = Router();
const problemRepository = new ProblemRepository();
const problemService = new ProblemService(problemRepository);
const problemController = new ProblemController(problemService);

// Use the controller in your routes
// router.get("/problems", problemController.getAllProblem);

router.post(
  "/create",
  isAuthorized,
  validator(DsaProblemSchema),
  createProblem
);
router.get("/get/:id", (req, res) =>
  problemController.getProblemById(req, res)
);
router.get("/getAll", isAuthorized, (req, res) =>
  problemController.getAllProblem(req, res)
);

export default router;
