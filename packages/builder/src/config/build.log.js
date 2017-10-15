let firstTime = true

module.exports = (fatalError, stats) => {
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

  if (firstTime) {
    console.log('\ncool, now:')
    console.log('run web --prod')
    if (!process.argv.indexOf('--watch')) {
      process.exit()
    }
  }
}
