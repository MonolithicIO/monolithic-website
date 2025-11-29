import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import js from "@eslint/js";
import globals from "globals";

const eslintConfig = defineConfig([
  js.configs.recommended,
  ...nextVitals,
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts", "coverage/**", "src/core/database/migrations/**"]),
  {
    files: ["**/*.ts"],
    languageOptions: {
      globals: {
        ...globals.jest,
      },
    },
    rules: {
      "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      "no-undef": "warn",
    },
  },
]);

export default eslintConfig;
