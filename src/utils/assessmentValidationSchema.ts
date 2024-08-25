import * as yup from "yup";

export const CreateAssessmentSchema = yup.object().shape({
  Choice3: yup.string().trim(),
  Choice4: yup.string().trim(),
  // Choice5: yup.string().trim()
  // Choice6: yup.string().trim()
  imgUrl: yup.string().trim(),
  Choice2: yup.string().trim().required("Choice2 is required"),
  Choice1: yup.string().trim().required("Choice1 is required"),
  Answer: yup.string().trim().required("Answer is required"),
  Type: yup.string().trim().required("Type is required"),
  Question: yup.string().trim().required("Question is required"),
});
