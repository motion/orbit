const LernaProject = require('@lerna/project')
const withTM = require('./next.transpiled-modules')
const withPlugins = require('next-compose-plugins')
const optimizedImages = require('next-optimized-images')
const { join } = require('path')

module.exports = withPlugins([
  [
    optimizedImages,
    {
      /* config for next-optimized-images */
    },
  ],

  withTM({
    transpileModules: ['shared'],
  }),
])
