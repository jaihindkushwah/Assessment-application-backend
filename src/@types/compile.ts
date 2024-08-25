export interface languageMap {
  c?: { language: string; version: string };
  cpp?: { language: string; version: string };
  python?: { language: string; version: string };
  java?: { language: string; version: string };
  javascript?: { language: string; version: string };
  typescript?: { language: string; version: string };
  go?: { language: string; version: string };
  rust?: { language: string; version: string };
  csharp?: { language: string; version: string };
  kts?: { language: string; version: string };
  kotlin?: { language: string; version: string };
  dart?: { language: string; version: string };
  swift?: { language: string; version: string };
  php?: { language: string; version: string };
}

export type programmingLanguage = keyof languageMap;
