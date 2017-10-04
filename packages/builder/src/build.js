process.env.NODE_ENV = 'production'
process.env.BABEL_ENV = 'production'

const webpack = require('webpack')
const config = require('./config/build.config')
const log = require('./config/build.log')

console.log('running webpack...')
webpack(config, log)
