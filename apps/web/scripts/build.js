process.env.NODE_ENV = 'production'

const webpack = require('webpack')
const config = require('./config/webpack')
const log = require('./config/webpackLog')

console.log('calling webpack')
webpack(config, log)
