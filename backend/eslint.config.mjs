import globals from "globals";
import pluginJs from "@eslint/js";

export default [
  {
    files: ["**/*.js"],
    languageOptions: {
      sourceType: "commonjs",
      globals: {
        // Explicitly allow 'process' as a global variable
        process: true,
      },
    },
  },
  {
    languageOptions: {
      globals: globals.browser,
    },
  },
  pluginJs.configs.recommended,
  {
    rules: {
      // Remove the no-process-env rule since we're handling process through globals
      // or if you want to keep it but allow process.env specifically:
      "no-process-env": "off",
    },
  },
];
