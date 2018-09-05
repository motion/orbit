import * as Path from 'path'
import serve from 'webpack-serve'

const root = Path.join(__dirname, '..')

process.env.NODE_ENV = process.env.NODE_ENV || 'development'
process.env.WEBPACK_MODULES = Path.join(root, 'node_modules')

console.log('node env', process.env.NODE_ENV)

async function start() {
  const config = require('./webpack.config').default
  const server = await serve(
    {},
    {
      port: 3999,
      host: 'localhost',
      config,
      hotClient: true,
    },
  )

  server.on('listening', () => {
    console.log('Running webpack-serve')
  })
}

start()
