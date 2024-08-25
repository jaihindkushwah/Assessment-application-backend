import { Model, model, ObjectId, Schema } from "mongoose";

interface QuizSetDocument {
  name: string;
  description: string;
  questions: string[];
  createBy: ObjectId;
}

const quizSetSchema = new Schema<QuizSetDocument>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    createBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
const QuizSet = model("QuizSet", quizSetSchema) as Model<QuizSetDocument>;

export default QuizSet;
