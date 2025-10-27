import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

export default [
  // Base Next.js + TypeScript config
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  // Custom ESLint config
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],
    rules: {
      // ✅ Disable unused vars rule (already in your file)
      "@typescript-eslint/no-unused-vars": "off",

      // ✅ Disable the 'Unexpected any' rule globally
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
];
