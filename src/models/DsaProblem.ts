import { Model, model, ObjectId, Schema } from "mongoose";

enum EDifficultyType {
  Easy = "Easy",
  Medium = "Medium",
  Hard = "Hard",
  Advance = "Advance",
}

export interface DsaProblemDocument {
  title: string;
  difficulty: EDifficultyType;
  content: string;
  testCases: string[];
  defaultTestCases: string[];
  codeSnippet: string;
  code: string;
  description?: string;
  createdBy: ObjectId;
}

const DsaProblemSchema = new Schema<DsaProblemDocument>(
  {
    title: {
      type: String,
      required: true,
    },
    difficulty: {
      type: String,
      default: EDifficultyType.Easy,
      enum: Object.values(EDifficultyType),
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    testCases: [
      {
        type: String,
      },
    ],
    defaultTestCases: [
      {
        type: String,
      },
    ],
    codeSnippet: {
      type: String,
    },
    description: {
      type: String,
    },
    code: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const DsaProblem = model(
  "DsaProblem",
  DsaProblemSchema
) as Model<DsaProblemDocument>;
export default DsaProblem;
