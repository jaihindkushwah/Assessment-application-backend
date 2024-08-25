import {
  createAssessmentQuiz,
  createQuizBulkUpload,
  getAssessmentQuizList,
} from "@/controller/quiz";
import { isAuthorized } from "@/middleware/auth";
import { validator } from "@/middleware/validator";
import { CreateAssessmentSchema } from "@/utils/assessmentValidationSchema";
import { Router } from "express";
// import formidable from "formidable";

const router = Router();

router.post(
  "/create",
  isAuthorized,
  validator(CreateAssessmentSchema),
  createAssessmentQuiz
);
router.post("/bulkUpload", isAuthorized, createQuizBulkUpload);
router.get("/getAll", isAuthorized, getAssessmentQuizList);
router.delete("/delete/:deleteId", createQuizBulkUpload);
router.put("/update/:updateId", createQuizBulkUpload);
router.get("/get/:quizId", createQuizBulkUpload);

export default router;
