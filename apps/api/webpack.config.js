const webpack = require('webpack')
const Fs = require('fs')
const Path = require('path')

const nodeModules = {}
Fs.readdirSync(Path.join(__dirname, 'node_modules'))
  .filter(x => ['.bin', '@mcro'].indexOf(x) === -1)
  .forEach(module => {
    nodeModules[module] = `commonjs ${module}`
  })

module.exports = {
  entry: [Path.join(__dirname, 'lib', 'index.js')],
  devtool: 'source-map',
  target: 'node',
  output: {
    path: Path.join(__dirname, 'build'),
    filename: 'out.js',
  },
  plugins: [new webpack.NamedModulesPlugin()],
  externals: nodeModules,
}
