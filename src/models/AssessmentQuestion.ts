import { Model, model, ObjectId, Schema } from "mongoose";

export interface AssessmentQuestionDocument {
  Question: string;
  Choice1: string;
  Choice2: string;
  Choice3: string;
  Choice4: string;
  // Choice5: string;
  // Choice6: string;
  Answer: string;
  Type: string;
  quizSetId: ObjectId;
  imgUrl: string;
  createBy: ObjectId;
}

const AssessmentQuestionSchema = new Schema<AssessmentQuestionDocument>(
  {
    Question: {
      type: String,
      required: true,
      trim: true,
    },
    Type: {
      type: String,
      required: true,
      trim: true,
    },
    Answer: {
      type: String,
      required: true,
      trim: true,
    },
    Choice1: {
      type: String,
      required: true,
    },
    Choice2: {
      type: String,
      required: true,
    },
    Choice3: {
      type: String,
    },
    Choice4: {
      type: String,
    },
    quizSetId: {
      type: Schema.Types.ObjectId,
      ref: "McqSet",
    },
    createBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    imgUrl: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const AssessmentQuestion = model(
  "AssessmentQuestion",
  AssessmentQuestionSchema
) as Model<AssessmentQuestionDocument>;
export default AssessmentQuestion;
