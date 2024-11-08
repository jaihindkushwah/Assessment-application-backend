import AssessmentQuestion from "@/models/AssessmentQuestion";
import { RequestHandler } from "express";
import formidable from "formidable";
import { readFileSync } from "fs";
import xlsx from "xlsx";

export const createAssessmentQuiz: RequestHandler = async (req, res) => {
  try {
    const question = new AssessmentQuestion({
      ...req.body,
      createBy: req.user?.id,
    });
    await question.save();
    return res.status(200).json({ data: question });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const createQuizBulkUpload: RequestHandler = async (req, res) => {
  try {
    const form = formidable({ multiples: false });

    form.parse(req, async (err, fields, files: any) => {
      if (err || !files) {
        console.error("Error parsing form data:", err);
        return res.status(500).json({ error: "Failed to parse form data" });
      }
      if (!files.fileName || !files.fileName[0]) {
        return res.status(400).json({ error: "Please provide file" });
      }
      const file = files.fileName[0];
      //    Check if the uploaded file is an Excel file
      if (
        file.mimetype !==
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      ) {
        return res
          .status(400)
          .json({ error: "Uploaded file is not an Excel file" });
      }
      // Read the Excel file without saving
      const workbook = xlsx.read(readFileSync(file.filepath), {
        type: "buffer",
      });

      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      let questions = xlsx.utils.sheet_to_json(sheet);
      questions = questions.map((x: any) => {
        x.createBy = req.user?.id;
        return x;
      });
      const data = xlsx.utils.sheet_to_json(sheet, { header: 1 });
      console.log(data[0]);
      try {
        const insertedQuestion = await AssessmentQuestion.insertMany(questions);

        return res.status(200).json({
          message: "File uploaded successfully",
          data: insertedQuestion,
        });
      } catch (error) {
        return res.status(500).json({ error: error });
      }
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
export const getAssessmentQuizList: RequestHandler = async (req, res) => {
  try {
    const createBy = req.user?.id;
    // const questions = await AssessmentQuestion.find({ createBy });
    const questions = await AssessmentQuestion.aggregate([
      { $match: { createBy } }, // Filter by createBy field
      { $sample: { size: 10 } }, // Randomly sample 10 documents
    ]);
    return res.status(200).json({ data: questions });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
// export const updateQuiz: RequestHandler = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const {} = req.body;
//     const question = await AssessmentQuestion.findByIdAndUpdate(id, {
//       ...req.body,
//     });
//     return res.status(200).json({ data: question });
//   } catch (error: any) {
//     res.status(500).json({ error: error.message });
//   }
// };
