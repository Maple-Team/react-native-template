const path = require('path')

module.exports = api => {
  const isTest = api.env('test')
  const isProduction = api.env('production')
  if (isTest) {
    return {
      presets: [
        '@babel/preset-typescript',
        '@babel/preset-react',
        [
          '@babel/preset-env',
          {
            // include: [/node_modules/],
          },
        ],
      ],
      plugins: [
        ['@babel/plugin-proposal-private-methods', { loose: true }],
        ['@babel/plugin-proposal-private-property-in-object', { loose: true }],
        ['@babel/plugin-proposal-class-properties', { loose: true }],
      ],
    }
  }
  const plugins = [
    ['import', { libraryName: '@ant-design/react-native' }],
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
  ]
  if (isProduction) {
    plugins.push(['transform-remove-console', { exclude: ['error', 'warn'] }])
  }
  return {
    presets: ['module:metro-react-native-babel-preset'],
    plugins,
  }
}
