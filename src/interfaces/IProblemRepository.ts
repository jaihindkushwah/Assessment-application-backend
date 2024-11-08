import { DsaProblemDocument } from "@/models/DsaProblem";

export interface IProblemRepository {
  findProblemById(id: string): Promise<DsaProblemDocument>;
  save(problem: DsaProblemDocument): Promise<DsaProblemDocument>;
  //   findAllProblems(): Promise<DsaProblemDocument[]>;
  findProblems(
    query: any,
    pagination: { skip: number; limit: number }
  ): Promise<any>;
  countProblems(query: any): Promise<number>;
  // createProblem: (problem: IProblem) => Promise<IProblem>
  // updateProblem: (problem: IProblem) => Promise<IProblem>
  // deleteProblem: (problemId: string) => Promise<IProblem>
  // getProblemById: (problemId: string) => Promise<IProblem>
}
