process.env.NODE_ENV = 'production'

const webpack = require('webpack')
const config = require('./config/webpack')

console.log('calling webpack')
webpack(config, (fatalError, stats) => {
  if (fatalError) {
    console.error(fatalError)
    return
  }

  const jsonStats = stats.toJson('verbose')
  const buildError = fatalError || jsonStats.errors[0] || jsonStats.warnings[0]

  if (buildError) {
    console.log(buildError)
  } else {
    console.log(
      stats.toString({
        assets: true,
        chunks: true,
        colors: true,
        hash: false,
        providedExports: true,
        timings: true,
        usedExports: true,
        version: false,
      })
    )
  }
})
