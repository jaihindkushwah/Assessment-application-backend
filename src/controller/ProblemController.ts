import { IProblemService } from "@/interfaces/IProblemService";
import { Request, Response } from "express";

export class ProblemController {
  private problemService: IProblemService;
  constructor(problemService: IProblemService) {
    this.problemService = problemService;
  }
  async getAllProblem(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const query = req.query as {
        page?: string;
        status?: string;
        difficulty?: string;
        limit?: string;
      };

      const page = parseInt(query.page || "1") || 1;
      const limit = parseInt(query.limit || "5") || 5;
      const result = await this.problemService.getAllProblem(
        query,
        userId,
        page,
        limit
      );
      res.status(200).json({
        ...result,
        message: "Problems fetched successfully",
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      }
    }
  }

  async getProblemById(req: Request, res: Response) {
    try {
      const problemId = req.params.id;
      const result = await this.problemService.getProblemById(problemId);
      console.log(result);
      res.status(200).json({
        problem: result,
        message: "Problem fetched successfully",
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      }
      res.status(500).json({ error: error });
    }
  }
  async createProblem(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const result = await this.problemService.createProblem(req.body, userId);
      res.status(200).json({ problem: result, message: "Problem created" });
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      }
      res.status(500).json({ error: error });
    }
  }
}
