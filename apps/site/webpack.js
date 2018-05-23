const webpack = require('webpack')
const devServer = require('webpack-dev-server')
const config = require('./webpack.config')

console.log(config)

const compiler = webpack(config)
const webpackServer = new devServer(compiler, {
  hot: true,
  publicPath: '/',
})

const port = 3004
const host = 'localhost'

webpackServer.listen(port, host, err => {
  if (err) {
    console.log(err)
  }
  console.log('Starting dev server', host, port)
})
