import * as yup from "yup";

export const CreateUserSchema = yup.object().shape({
  password: yup
    .string()
    .trim()
    .required("Password is required")
    .min(8, "Password is too short")
    //   password must contains one UpperCase letter, one LowerCase letter, one number and one special character
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      "Password must contains one UpperCase letter, one LowerCase letter, one number and one special character"
    ),
  email: yup
    .string()
    .trim()
    .email("Invalid email")
    .required("Email is required"),
  name: yup
    .string()
    .trim()
    .required("Name is required")
    .min(3, "Name is too short")
    .max(20, "Name is too long"),
});

export const LoginSchema = yup.object().shape({
  password: yup
    .string()
    .trim()
    .required("Password is required")
    .min(8, "Password is too short")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      "Password must contains one UpperCase letter, one LowerCase letter, one number and one special character"
    ),
  email: yup
    .string()
    .trim()
    .email("Invalid email")
    .required("Email is required"),
});
export const VerificationSchema = yup.object().shape({
  email: yup
    .string()
    .trim()
    .email("Invalid email")
    .required("Email is required"),
});
export const UpdateProfilePic = yup.object().shape({
  avatarUrl: yup.string().trim().required("url is required"),
  publicId: yup.string().trim().required("publicId is required"),
});

export const CompilerSchema = yup.object().shape({
  code: yup.string().trim().required("Code is required"),
  language: yup.string().trim().required("Language is required"),
  input: yup.string().trim(),
  problemId: yup.string().trim().required("problemId is required"),
});

export const DsaProblemSchema = yup.object().shape({
  title: yup.string().trim().required("title is required"),
  difficulty: yup.string().trim().required("difficulty is required"),
  content: yup.object().required("content is required"),
  testCases: yup.array().of(yup.string().trim()),
  defaultTestCases: yup.array().of(yup.string().trim()),
  codeSnippet: yup.string().trim(),
  code: yup.string().trim(),
});
