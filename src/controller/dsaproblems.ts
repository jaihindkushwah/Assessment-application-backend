import DsaProblem from "@/models/DsaProblem";
import { RequestHandler } from "express";

// import DsaProblemSubmission from "@/models/DsaSubmission";

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

const getProblemById: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(404).json({ message: "Please provide problem id" });
    }
    // console.log(id);
    const problem = await DsaProblem.findById(id);
    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }
    res.status(200).json({ problem });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

enum EStatusType {
  Solved = "solved",
  Unsolved = "unsolved",
}

const getAllProblem: RequestHandler = async (req, res) => {
  try {
    // if (!req.user?.id) {
    //   return res.status(500).json({ error: "Please login first" });
    // }
    console.log(req.user?.id);
    const query = req.query as {
      page?: string;
      status?: string;
      difficulty?: string;
      tags?: string;
      limit?: string;
    };

    console.log(query);
    const difficulty = query.difficulty?.split(",") || [];
    // const tags = query.tags?.split(",") || [];
    const page = parseInt(query.page || "1") || 1;
    const limit = parseInt(query.limit || "5") || 5;
    const difficulties = query.difficulty?.split(",") || [];
    const statuses = query.status?.split(",") || [];

    // Build the aggregation pipeline
    const pipeline = [
      // Stage 1: Match difficulties if provided
      ...(difficulties.length > 0
        ? [
            {
              $match: {
                ...(difficulty.length > 0
                  ? { difficulty: { $in: difficulty } }
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
          userId: { $in: [req.user?.id, "$submissions.userId"] },
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

    // Execute the aggregation
    const problems = await DsaProblem.aggregate(pipeline)
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();

    // Get total count for pagination
    const totalProblems = await DsaProblem.aggregate(pipeline)
      .count("count")
      .exec()
      .then((result) => {
        console.log(result);
        if (result.length > 0) {
          return result[0].count;
        }
        return 0;
      });

    res.status(200).json({
      problems,
      currentPage: page,
      totalPages: Math.ceil(totalProblems / limit),
      totalProblems,
      message: "Problems fetched successfully",
    });
  } catch (error) {
    console.error("Error fetching problems:", error);
    res.status(500).json({
      message: "Error fetching problems",
      error: (error as Error).message,
    });
  }
};

export { createProblem, getProblemById, getAllProblem };
