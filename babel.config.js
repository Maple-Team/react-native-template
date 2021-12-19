// const path = require('path')

module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    ['import', {libraryName: '@ant-design/react-native'}],
    [
      'module-resolver',
      {
        root: ['./'],
        extensions: [
          '.ios.ts',
          '.android.ts',
          '.ts',
          '.tsx',
          '.ios.tsx',
          '.android.tsx',
          '.jsx',
          '.js',
          '.json',
        ],
        alias: {
          '@screens': path.resolve(__dirname, './src/screens'),
          '@navigation': path.resolve(__dirname, './src/navigation'),
          '@components': path.resolve(__dirname, './src/components'),
          '@assets': path.resolve(__dirname, './src/assets'),
          '@': path.resolve(__dirname, './src'),
        },
      },
    ],
  ],
}
