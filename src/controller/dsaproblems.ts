import { RequestHandler } from "express";

const createProblem: RequestHandler = async (req: any, res: any) => {
  try {
    const { code, input, language } = req.body;
    // const response = await compiler(code, language, input);
    // const output = await response;
    // res.status(200).json({ output });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
const createBulkProblems: RequestHandler = async (req: any, res: any) => {
  try {
    const { code, input, language } = req.body;
    // const response = await compiler(code, language, input);
    // const output = await response;
    // res.status(200).json({ output });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export { createProblem, createBulkProblems };
