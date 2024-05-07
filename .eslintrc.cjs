/** @type {import("eslint").Linter.Config} */
const config = {
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "project": true
  },
  "plugins": [
    "@typescript-eslint",
    "drizzle"
  ],
  "extends": [
    "next/core-web-vitals",
    "plugin:@typescript-eslint/recommended-type-checked",
    "plugin:@typescript-eslint/stylistic-type-checked"
  ],
  "rules": {
    "@typescript-eslint/no-unsafe-member-access":"off",
    "@typescript-eslint/array-type": "off",
    'prefer-const':0,
    "@typescript-eslint/no-unsafe-return":"off",
    "@typescript-eslint/no-unsafe-assignment":"off",
    "@typescript-eslint/no-unsafe-argument":"off",
    "@typescript-eslint/no-floating-promises":"off",
    "@typescript-eslint/no-explicit-any":"off",
    "@typescript-eslint/consistent-type-definitions": "off",
    "@typescript-eslint/consistent-type-imports": [
      "warn",
      {
        "prefer": "type-imports",
        "fixStyle": "inline-type-imports"
      }
    ],
    "@typescript-eslint/no-unused-vars": "off",
    "@typescript-eslint/require-await": "off",
    "@typescript-eslint/no-misused-promises": [
      "error",
      {
        "checksVoidReturn": {
          "attributes": false
        }
      }
    ],
    "drizzle/enforce-delete-with-where": "error",
    "drizzle/enforce-update-with-where": "error",
    "@typescript-eslint/prefer-nullish-coalescing": "off",
  }
}
module.exports = config;