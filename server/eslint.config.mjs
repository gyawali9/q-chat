import js from "@eslint/js";
import globals from "globals";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import { defineConfig } from "eslint/config";

export default defineConfig({
  ignores: ["dist/**", "node_modules/**"],
  overrides: [
    {
      files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
      plugins: { js, "@typescript-eslint": tsPlugin },
      extends: ["js/recommended", "plugin:@typescript-eslint/recommended"],
      parser: tsParser,
      languageOptions: {
        globals: globals.browser,
      },
    },
  ],
});
