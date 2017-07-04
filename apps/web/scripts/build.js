process.env.NODE_ENV = 'production'

const webpack = require('webpack')
const config = require('./config/webpack')
const paths = require('./config/paths')
const log = require('./config/log')

console.log('calling webpack')
webpack(config, log)
