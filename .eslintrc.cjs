/** @type {import("eslint").Linter.Config} */
const config = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: true,
  },
  plugins: ["@typescript-eslint", "drizzle"],
  extends: [
    "next/core-web-vitals",
    "plugin:@typescript-eslint/recommended-type-checked",
    "plugin:@typescript-eslint/stylistic-type-checked",
  ],
  rules: {
    "@next/next/no-async-client-component": "off",
    "react-hooks/rules-of-hooks": "off",
    "@typescript-eslint/no-unused-expressions": "off",
    "@typescript-eslint/prefer-nullish-coalescing": "off",
    "@typescript-eslint/no-empty-function": "off",
    "@next/next/no-img-element": "off",
    "@typescript-eslint/prefer-optional-chain": "off",
    "@typescript-eslint/consistent-type-definitions": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-unsafe-assignment": "off",
    "@typescript-eslint/no-unsafe-member-access": "off",
    "@typescript-eslint/no-unsafe-call": "off",
    "@typescript-eslint/no-unsafe-return": "off",
    "@typescript-eslint/restrict-template-expressions": "off",
    "@typescript-eslint/no-floating-promises": "off",
    "@typescript-eslint/no-misused-promises": "off",
    "@typescript-eslint/no-unused-vars": "off",
    "@typescript-eslint/consistent-type-imports": "off",
    "react-hooks/exhaustive-deps": "off",
    "@typescript-eslint/ban-ts-comment": "off",
    "@typescript-eslint/array-type": "off",
    "prefer-const": 0,
    "@typescript-eslint/no-unsafe-argument": "off",
    // "@typescript-eslint/consistent-type-imports": [
    //   "warn",
    //   {
    //     prefer: "type-imports",
    //     fixStyle: "inline-type-imports",
    //   },
    // ],
    // "@typescript-eslint/no-unused-vars": "off",
    "@typescript-eslint/require-await": "off",
    // "@typescript-eslint/no-misused-promises": [
    //   "error",
    //   {
    //     checksVoidReturn: {
    //       attributes: false,
    //     },
    //   },
    // ],
    "@typescript-eslint/no-require-imports": "off",
    "@typescript-eslint/no-unnecessary-type-assertion": "warn",
    "drizzle/enforce-delete-with-where": ["error", {
      drizzleObjectName: "db"
    }],
    "drizzle/enforce-update-with-where": ["error", {
      drizzleObjectName: "db"
    }],
    "@typescript-eslint/restrict-plus-operands": "warn",
  },
};
module.exports = config;
