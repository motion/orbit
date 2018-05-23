import webpack from 'webpack'
import config from './webpack.config'
import log from './log'
import paths from './paths'
import { ncp } from 'ncp'
import fs from 'fs'

console.log('build for prod...')

if (fs.existsSync(paths.appPublic)) {
  ncp(paths.appPublic, paths.appBuild, console.log.bind(console))
}

webpack(config, log)
