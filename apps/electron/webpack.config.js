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
  target: 'electron',
  output: {
    path: Path.join(__dirname, 'build'),
    filename: 'out.js',
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
  ],
  externals: nodeModules,
}
