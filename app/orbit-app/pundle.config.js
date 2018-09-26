const path = require('path')
const presetDefault = require('@pundle/preset-default')

const pundleConfig = {
  target: 'browser',
  entry: ['./src/main.ts', './index.html'],
  components: presetDefault({
    transform: {
      typescript: true,
      babel: 7,
    },
    optimize: {
      js: {
        common: {
          processNonRootChunks: true,
        },
      },
    },
  }),
  rootDirectory: __dirname,
  output: {
    rootDirectory: path.join(__dirname, 'dist'),
  },
}

module.exports = pundleConfig
