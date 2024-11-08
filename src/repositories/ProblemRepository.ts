import { IProblemRepository } from "@/interfaces/IProblemRepository";
import DsaProblem, { DsaProblemDocument } from "@/models/DsaProblem";

export class ProblemRepository implements IProblemRepository {
  async findProblemById(id: string): Promise<any> {
    return DsaProblem.findOne({ _id: id });
  }

  async save(problem: DsaProblemDocument): Promise<any> {
    return problem.save();
  }

  async findProblems(
    query: any,
    pagination: { skip: number; limit: number }
  ): Promise<any> {
    return DsaProblem.aggregate(query)
      .skip(pagination.skip)
      .limit(pagination.limit);
  }

  async countProblems(query: any): Promise<number> {
    const result = await DsaProblem.aggregate(query).count("count").exec();
    return result.length > 0 ? result[0].count : 0;
  }
}
