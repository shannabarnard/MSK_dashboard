import eslintConfigPrettier from "eslint-config-prettier";
import prettierPlugin from "eslint-plugin-prettier";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";
import withNuxt from "./.nuxt/eslint.config.mjs";

const globalIgnores = [
  "dist/*",
  "coverage/*",
  "node_modules/*",
  ".nuxt/*",
  ".output/*",
  "playwright-report/*",
  "test-results/*",
];

export default withNuxt([
  {
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      ...eslintConfigPrettier.rules,
      ...eslintPluginPrettierRecommended.rules,
      "vue/no-deprecated-slot-attribute": "off",
      "vue/no-static-inline-styles": "error",
      "vue/eqeqeq": "error",
      "vue/v-bind-style": [
        "error",
        "shorthand",
        {
          sameNameShorthand: "always",
        },
      ],
      "vue/require-default-prop": "error",
      "vue/prefer-true-attribute-shorthand": "error",
      eqeqeq: "error",
      curly: "error",
      "no-else-return": "error",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
    },
    ignores: globalIgnores,
  },
])
  .override("nuxt/rules", {
    files: ["**/*.vue"],
    ignores: globalIgnores,
    rules: {
      "vue/no-bare-strings-in-template": "off",
    },
  })
  .override("nuxt/typescript/rules", {
    ignores: globalIgnores,
    rules: {
      "@typescript-eslint/consistent-type-imports": "error",
      "@typescript-eslint/naming-convention": [
        "error",
        {
          selector: "enumMember",
          format: ["PascalCase"],
        },
      ],
    },
  });
