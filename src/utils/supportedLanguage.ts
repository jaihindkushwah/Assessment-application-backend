import { languageMap } from "@/@types/compile";

// https://emkc.org/api/v2/piston/runtimes list of languages

let supportedLanguage: languageMap = {
  c: { language: "c", version: "10.2.0" },
  cpp: { language: "c++", version: "10.2.0" },
  python: { language: "python", version: "3.10.0" },
  java: { language: "java", version: "15.0.2" },
  javascript: { language: "javascript", version: "18.15.0" },
  php: { language: "php", version: "8.2.3" },
};
export { supportedLanguage };
