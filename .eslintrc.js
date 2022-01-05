module.exports = {
  root: true,
  extends: '@react-native-community',
  rules: {
    semi: 0,
    'no-shadow': 'off',
    '@typescript-eslint/no-shadow': ['error'],
    'react-native/no-inline-styles': 'off', // FIXME
  },
}
