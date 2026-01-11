// eslint.config.mjs
import { defineConfig, globalIgnores } from "eslint/config";
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import nextVitals from "eslint-config-next/core-web-vitals";

export default defineConfig([
  ...nextVitals,

  js.configs.recommended,

  ...tseslint.configs.recommended,

  // Custom rules
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    rules: {
      indent: ["error", 2],
      "linebreak-style": ["error", "unix"],
      quotes: ["error", "single"],
      semi: ["error", "always"],

      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_" },
      ],
      "no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
    },
  },

  // disable base no-unused-vars in TS files (avoids duplicate reports)
  {
    files: ["**/*.{ts,tsx}"],
    rules: {
      "no-unused-vars": "off",
      indent: "off",
    },
  },

  // ignores
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "dist/**",
    "node_modules/**",
    "coverage/**",
    "next-env.d.ts",
  ]),
]);
