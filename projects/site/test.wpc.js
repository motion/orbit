const path = require('path')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')

module.exports = {
  mode: 'production',
  entry: {
    test: './src/index.tsx',
  },
  output: {
    filename: '[name].js',
    path: path.join(__dirname, 'dist'),
  },
  optimization: {
    usedExports: true,
    sideEffects: true,
  },
  stats: {
    // Examine all modules
    maxModules: Infinity,
    // Display bailout reasons
    optimizationBailout: true,
  },
  resolve: {
    extensions: ['.wasm', '.mjs', '.js', '.jsx', '.ts', '.tsx'],
    mainFields: ['ts:main', 'module', 'browser', 'main'],
  },
  externals: {
    electron: '{}',
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: 'babel-loader',
            options: JSON.parse(
              require('fs').readFileSync(path.join(__dirname, '.babelrc'), 'utf-8'),
            ),
          },
        ].filter(Boolean),
      },
      {
        test: /\.css?/,
        use: 'ignore-loader',
      },
    ],
  },
  plugins: [new BundleAnalyzerPlugin()],
}
