import { createBulkProblems, createProblem } from "@/controller/dsaproblems";
import { Router } from "express";

const router = Router();

// router.get('/get/:quizId',getDsaProblem);

router.post("/create", createProblem);
router.post("/bulkUpload", createBulkProblems);
router.get("/get", createBulkProblems);
router.delete("/delete/:deleteId", createBulkProblems);
router.put("/update/:updateId", createBulkProblems);

export default router;
