const withTM = require('next-transpile-modules')
const withPlugins = require('next-compose-plugins')
const optimizedImages = require('next-optimized-images')

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
