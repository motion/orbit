// @ts-ignore
import webpack from 'webpack'
import config from './webpack.config'
import log from './log'
import paths from './paths'
import { ncp } from 'ncp'
import fs from 'fs'

if (fs.existsSync(paths.appPublic)) {
  ncp(paths.appPublic, paths.appBuild, console.log.bind(console))
}

process.env.NODE_ENV = process.env.NODE_ENV || 'production'

console.log('build for prod... process.env.NODE_ENV', process.env.NODE_ENV)
webpack(
  {
    mode: 'production',
    ...config,
  },
  log,
)
