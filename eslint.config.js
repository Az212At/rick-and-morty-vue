import js from "@eslint/js";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import vue from "eslint-plugin-vue";
import vueParser from "vue-eslint-parser";
import prettier from "eslint-config-prettier";
import globals from "globals";

export default [
  { ignores: ["dist/**", "coverage/**", "node_modules/**"] },
  js.configs.recommended,
  ...vue.configs["flat/recommended"],
  {
    files: ["**/*.{js,ts,vue}"],
    languageOptions: {
      globals: { ...globals.browser, ...globals.node, ...globals.vitest },
    },
  },
  {
    files: ["**/*.{ts,vue}"],
    plugins: { "@typescript-eslint": tsPlugin },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      "no-undef": "off",
      "@typescript-eslint/consistent-type-imports": "error",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
    },
  },
  {
    files: ["**/*.ts"],
    languageOptions: {
      parser: tsParser,
      parserOptions: { ecmaVersion: "latest", sourceType: "module" },
    },
  },
  {
    files: ["**/*.vue"],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tsParser,
        ecmaVersion: "latest",
        sourceType: "module",
        extraFileExtensions: [".vue"],
      },
    },
    rules: {
      "vue/block-lang": ["error", { script: { lang: "ts" } }],
      "vue/component-api-style": ["error", ["script-setup"]],
      "vue/define-props-declaration": ["error", "type-based"],
      "vue/define-emits-declaration": ["error", "type-based"],
    },
  },
  prettier,
];
