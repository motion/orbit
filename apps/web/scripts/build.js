process.env.NODE_ENV = 'production'

const webpack = require('webpack')
const config = require('./config/build.config')
const log = require('./config/build.log')

console.log('calling webpack')
webpack(config, log)
