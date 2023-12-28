module.exports = {
  parser: "babel-eslint",
  parserOptions: {
    sourceType: "module",
    ecmaVersion: 8,
    ecmaFeatures: {
      jsx: true,
    },
  },

  env: {
    browser: true,
    node: true,
    es6: true,
  },
  extends: ["eslint:recommended", "plugin:react/recommended", "prettier"],
  plugins: ["react", "prettier"],
  rules: {
    "react/prop-types": "off",
    "no-unused-vars": "off",
    "no-mixed-spaces-and-tabs": "off",
    "react/no-unescaped-entities": "off",
    "no-control-regex": "off",
    "no-console": "off",
    "react/no-deprecated": "off",
    "prettier/prettier": [
      "error",
      {
        endOfLine: "auto",
      },
    ],
  },
  settings: {
    react: { version: "detect" },

    "import/resolver": {
      node: {
        extensions: [".js", ".jsx", ".ts", ".tsx"],
      },
    },
  },
};
