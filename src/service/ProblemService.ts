import { IProblemRepository } from "@/interfaces/IProblemRepository";
import { IProblemService } from "@/interfaces/IProblemService";

export enum EStatusType {
  Solved = "solved",
  Unsolved = "unsolved",
}

export class ProblemService implements IProblemService {
  private problemRepository: IProblemRepository;
  constructor(problemRepository: IProblemRepository) {
    this.problemRepository = problemRepository;
  }
  async getProblemById(id: string) {
    const problem = await this.problemRepository.findProblemById(id);
    // console.log(problem);
    return problem;
  }
  async createProblem(data: any, userId: string) {
    // const problem = await this.problemRepository.createProblem(data, userId);
    // if (req.user?.role !== "admin") {
    //   return res.status(401).json({ message: "You are not authorized" });
    // }
    // const {
    //   title,
    //   difficulty,
    //   content,
    //   testCases,
    //   defaultTestCases,
    //   codeSnippet,
    //   code,
    //   description,
    // } = req.body;

    // const problem = new DsaProblem({
    //   title,
    //   difficulty,
    //   content: JSON.stringify(content),
    //   testCases,
    //   defaultTestCases,
    //   codeSnippet,
    //   code,
    //   description,
    //   createdBy: req.user?.id,
    // });

    // await problem.save();
    throw new Error("Method not implemented");
  }
  async getAllProblem(
    query: any,
    userId: string | undefined,
    page: number,
    limit: number
  ) {
    const { status, difficulty } = query;

    const difficulties = difficulty?.split(",") || [];
    const statuses = status?.split(",") || [];

    // Build the aggregation pipeline
    const pipeline = [
      // Stage 1: Match difficulties if provided
      ...(difficulties.length > 0
        ? [
            {
              $match: {
                ...(difficulties.length > 0
                  ? { difficulty: { $in: difficulties } }
                  : {}),
              },
            },
          ]
        : []),

      // Stage 2: Lookup submissions
      {
        $lookup: {
          from: "dsaproblemsubmissions",
          localField: "_id",
          foreignField: "problemId",
          as: "submissions",
        },
      },

      // Stage 4: Add fields for problem status
      {
        $addFields: {
          userId: { $in: [userId, "$submissions.userId"] },
          problemStatus: {
            $cond: {
              if: { $in: [EStatusType.Solved, "$submissions.status"] },
              then: EStatusType.Solved,
              else: EStatusType.Unsolved,
            },
          },
        },
      },
      {
        $match: {
          ...(statuses.length > 0
            ? {
                $or: [
                  { problemStatus: statuses[0] },
                  { problemStatus: statuses[1] },
                ],
              }
            : {}),
        },
      },

      // Stage 5: Project only necessary fields
      {
        $project: {
          _id: 1,
          title: 1,
          difficulty: 1,
          // userId: 1,
          // content: 1,
          // testCases: 1,
          // defaultTestCases: 1,
          // codeSnippet: 1,
          // description: 1,
          // code: 1,
          createdAt: 1,
          updatedAt: 1,
          // problemStatus: 1,
          status: "$problemStatus",
          submissionCount: { $size: "$submissions" },
          // count: { $count: "Total" },
        },
      },
      // Stage 6: Pagination
      // { $skip: (page - 1) * limit },
      // { $limit: limit },
    ];

    // Fetch problems and count
    const problems = await this.problemRepository.findProblems(pipeline, {
      skip: (page - 1) * limit,
      limit,
    });

    const totalProblems = await this.problemRepository.countProblems(pipeline);

    return {
      problems,
      currentPage: page,
      totalPages: Math.ceil(totalProblems / limit),
      totalProblems,
    };
  }
  async updateProblem(id: string) {
    throw new Error("Method not implemented.");
  }
}
