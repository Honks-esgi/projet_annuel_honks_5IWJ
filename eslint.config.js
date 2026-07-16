// eslint.config.js
const { defineConfig } = require("eslint/config");
const tsParser = require("@typescript-eslint/parser");
const tsPlugin = require("@typescript-eslint/eslint-plugin");

module.exports = defineConfig([
    {
        ignores: [
            "**/node_modules/**",
            "**/dist/**",
            "**/build/**",
            "**/.next/**",
            "**/coverage/**",
            "**/*.min.js",
        ],
    },
    {
        files: ["**/*.js", "**/*.jsx"],
        rules: {
            semi: "error",
            "prefer-const": "error",
        },
    },
    {
        files: ["**/*.ts", "**/*.tsx"],
        plugins: {
            "@typescript-eslint": tsPlugin,
        },
        languageOptions: {
            parser: tsParser,
        },
        rules: {
            semi: "error",
            "prefer-const": "error",
        },
    },
]);
