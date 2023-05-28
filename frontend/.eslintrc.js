module.exports = {
  extends: require.resolve('@umijs/max/eslint'),
  rules: {
    'react/no-children-prop': 0,
    '@typescript-eslint/no-unused-vars': 1,
    '@typescript-eslint/no-use-before-define': 1,
  },
};
