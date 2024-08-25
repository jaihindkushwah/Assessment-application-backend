import { testDsaProblem, submitDsaProblem } from "@/controller/compiler";
import { isAuthorized } from "@/middleware/auth";
import { validator } from "@/middleware/validator";
import { CompilerSchema } from "@/utils/validationSchema";
import { Router } from "express";

const router = Router();

router.post("/test", isAuthorized, validator(CompilerSchema), testDsaProblem);
router.post("/submit", validator(CompilerSchema), submitDsaProblem);

export default router;
