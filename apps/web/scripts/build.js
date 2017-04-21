process.env.NODE_ENV = 'production'

const webpack = require('webpack')
const config = require('./config/webpack')

webpack(config, console.log.bind(console))
