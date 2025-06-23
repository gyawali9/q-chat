import js from "@eslint/js";
import globals from "globals";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import { defineConfig } from "eslint/config";

export default defineConfig({
  ignores: ["dist/**", "node_modules/**"],

  files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],

  languageOptions: {
    parser: tsParser,
    globals: globals.node, // or globals.browser based on your env
  },

  plugins: {
    "@typescript-eslint": tsPlugin,
  },

  rules: {
    ...js.configs.recommended.rules,
    ...tsPlugin.configs.recommended.rules,
  },
});
