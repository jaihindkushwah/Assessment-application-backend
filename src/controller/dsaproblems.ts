import DsaProblem from "@/models/DsaProblem";
import { RequestHandler } from "express";

const createProblem: RequestHandler = async (req, res) => {
  try {
    // const { code, input, language } = req.body;
    if (req.user?.role !== "admin") {
      return res.status(401).json({ message: "You are not authorized" });
    }
    const {
      title,
      difficulty,
      content,
      testCases,
      defaultTestCases,
      codeSnippet,
      code,
      description,
    } = req.body;

    const problem = new DsaProblem({
      title,
      difficulty,
      content: JSON.stringify(content),
      testCases,
      defaultTestCases,
      codeSnippet,
      code,
      description,
      createdBy: req.user?.id,
    });

    await problem.save();

    res.status(200).json({ problem });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export { createProblem };
