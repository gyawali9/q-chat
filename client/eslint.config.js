import js from "@eslint/js";
import tseslint from "typescript-eslint";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";

export default tseslint.config(
  { ignores: ["dist"] },
  js.configs.recommended,
  tseslint.configs.recommended,
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: "module",
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
      globals: {
        window: "readonly",
        document: "readonly",
      },
    },
    plugins: {
      react,
      "react-hooks": reactHooks,
      // '@typescript-eslint' plugin removed here
    },
    rules: {
      // react rules you want:
      "react/jsx-uses-react": "off", // React 17+ JSX transform no need for this
      "react/react-in-jsx-scope": "off",

      // react-hooks rules
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",

      // typescript-eslint rules
      "@typescript-eslint/consistent-type-imports": [
        "error",
        { prefer: "type-imports" },
      ],

      // your other rules...
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  }
);
