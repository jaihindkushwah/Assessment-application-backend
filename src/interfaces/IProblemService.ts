export interface IProblemService {
  getProblemById(id: string): Promise<any>;
  getAllProblem(
    query: any,
    userId: string | undefined,
    page: number,
    limit: number
  ): Promise<any>;
  updateProblem(id: string): Promise<any>;
  createProblem(data: any, userId: string): Promise<any>;
}
