module.exports = {
  parserOptions: {
    sourceType: "module",
    ecmaVersion: 13,
    ecmaFeatures: {
      jsx: true,
      },
  },

  env: {
    browser: true,
    node: true,
    es6: true,
  },
  extends: ["eslint:recommended", "plugin:react/recommended"],
  plugins: ["react"],
  rules: {
    "react/prop-types": "off",
    "no-unused-vars": "off",
    "no-mixed-spaces-and-tabs": "off",
    "react/no-unescaped-entities": "off",
    "no-control-regex": "off",
    "react/no-deprecated": "off"
  },
};
