import mongoose from "mongoose";

enum EStatusType {
  Solved = "solved",
  Unsolved = "unsolved",
}
//   Attempted = "attempted",

interface DsaSubmissionDocument {
  problemId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  code: string;
  language: string;
  status: EStatusType;
  createdAt: Date;
}

const DsaProblemSubmissionSchema = new mongoose.Schema<DsaSubmissionDocument>({
  problemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "DsaProblem",
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
  language: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: EStatusType.Unsolved,
    enum: EStatusType,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const DsaProblemSubmission = mongoose.model<DsaSubmissionDocument>(
  "DsaProblemSubmission",
  DsaProblemSubmissionSchema
);

export default DsaProblemSubmission;
