const webpack = require('webpack')
const Fs = require('fs')
const Path = require('path')

const nodeModules = [
  Path.join(__dirname, 'node_modules'),
  Path.join(__dirname, '..', '..', 'node_modules'),
]
  .map(name => Fs.readdirSync(name))
  .filter(x => ['.bin', '@mcro'].indexOf(x) === -1)
  .reduce(
    (res, key) => ({
      ...res,
      [key]: `commonjs ${module}`,
    }),
    {}
  )

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
