import webpack from 'webpack'
import config from './webpack.config'
import log from './log'

process.env.NODE_ENV = process.env.NODE_ENV || 'production'

console.log('build for prod... process.env.NODE_ENV', process.env.NODE_ENV)

webpack(
  // @ts-ignore
  {
    mode: 'production',
    ...config,
  },
  log,
)
