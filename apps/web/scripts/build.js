process.env.NODE_ENV = 'production'

const webpack = require('webpack')
const config = require('./config/webpack')
const paths = require('./config/paths')
const log = require('./config/log')
const ncp = require('ncp')
const Path = require('path')

webpack(config, log)

ncp(paths.appPublic, paths.appBuild)

// output 200.html file for surge routing
ncp(
  Path.join(paths.appPublic, 'index.html'),
  Path.join(paths.appBuild, '200.html')
)
