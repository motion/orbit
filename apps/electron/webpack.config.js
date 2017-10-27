const webpack = require('webpack')
const Fs = require('fs')
const Path = require('path')

const nodeModules = {}
Fs.readdirSync(Path.join(__dirname, 'node_modules'))
  .filter(x => ['.bin'].indexOf(x) === -1)
  .forEach(module => {
    nodeModules[module] = `commonjs ${module}`
  })

module.exports = {
  entry: ['webpack/hot/poll?500', Path.join(__dirname, 'lib', 'index.js')],
  devtool: 'source-map',
  target: 'electron',
  output: {
    path: Path.join(__dirname, 'build'),
    filename: 'out.js',
  },
  resolve: {
    extensions: ['.js', '.json', '.node'],
  },
  module: {
    rules: [
      {
        test: /\.node$/,
        use: 'node-loader',
      },
    ],
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
    new webpack.NormalModuleReplacementPlugin(
      /^bindings$/,
      require.resolve('./bindings')
    ),
  ],
  externals: nodeModules,
}
