process.env.NODE_ENV = 'production'
process.env.BABEL_ENV = 'production'

const webpack = require('webpack')
const config = require('./config/build.config')
const log = require('./config/build.log')
const { ncp } = require('ncp')
const Path = require('path')
const path = (...path) => Path.join(__dirname, '..', ...path)

console.log('running webpack...')
ncp(path('public'), path('build'), console.log.bind(console))
webpack(config, log)
