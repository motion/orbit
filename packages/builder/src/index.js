import webpack from 'webpack'
import config from './config/build.config'
import log from './config/build.log'
import paths from './config/paths'
import { ncp } from 'ncp'
import fs from 'fs'

console.log('running webpack...')
if (fs.existsSync(paths.appPublic)) {
  ncp(paths.appPublic, paths.appBuild, console.log.bind(console))
}
webpack(config, log)
