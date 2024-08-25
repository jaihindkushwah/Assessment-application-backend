import { RequestHandler } from "express";
import Axios from "axios";
import { programmingLanguage } from "@/@types/compile";
import { supportedLanguage } from "@/utils/supportedLanguage";

// GET  list of supported programming languages
// https://emkc.org/api/v2/piston/runtimes

// POST execute code
// https://emkc.org/api/v2/piston/execute

export const testDsaProblem: RequestHandler = async (req, res) => {
  try {
    console.log("user input", req.user);
    const { code, input, language } = req.body;
    const response = await compiler(code, language, input);
    const output = await response;
    res.status(200).json({ output });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
export const submitDsaProblem: RequestHandler = async (req, res) => {
  try {
    // and also accept start time and end time so that we can calculate the time taken by user or total time
    const { code, input, language } = req.body;
    const response = await compiler(code, language, input);

    // save to database
    // test results save in database with no of attempts on the basis of that deducts marks

    const output = await response;
    res.status(200).json({ output });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

const compiler = async (
  code: string,
  language: programmingLanguage,
  input: string
) => {
  // add list of programming languages in data base and create an api for getting the version and language

  const languageMap = supportedLanguage;
  if (!languageMap[language]) {
    throw new Error("Unsupported language");
  }

  let data = {
    language: languageMap[language].language,
    version: languageMap[language].version,
    files: [
      {
        name: "main",
        content: code,
      },
    ],
    stdin: input,
  };
  let config = {
    method: "post",
    url: "https://emkc.org/api/v2/piston/execute",
    headers: {
      "Content-Type": "application/json",
    },
    data: data,
  };
  // calling the code compilation API
  try {
    const res = await Axios(config);
    let response = await { ...res.data.run };
    return response;
  } catch (error) {
    console.log(error);
    throw new Error(error as string);
  }
};