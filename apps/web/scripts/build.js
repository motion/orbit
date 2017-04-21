process.env.NODE_ENV = 'production'

const webpack = require('webpack')
const config = require('./config/webpack')
const paths = require('./config/paths')
const ncp = require('ncp')

webpack(config, console.log.bind(console))

ncp(paths.appPublic, paths.appBuild)
