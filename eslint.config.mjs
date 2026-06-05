import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    // Default for most JS files (ES Modules)
    files: ["**/*.{js,mjs}"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      sourceType: "module", // Important: ES Modules
    },
  },
  {
    // For CommonJS files (if any)
    files: ["**/*.cjs"],
    languageOptions: { sourceType: "script" }, // Node-style CommonJS
  },
]);
