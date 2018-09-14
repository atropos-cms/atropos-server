module.exports = {
  root: true,
  parserOptions: {
    'parser': 'babel-eslint',
    'ecmaVersion': 2017,
    "ecmaFeatures": {
      "experimentalObjectRestSpread": true
    }
  },
  env: {
    browser: false,
    node: true
  },
  extends: [
    'standard'
  ],
  // add your custom rules here
  rules: {},
  globals: {
    "use": false
  }
};