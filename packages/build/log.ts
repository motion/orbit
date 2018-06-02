import * as Fs from 'fs'

export default (...args) => {
  const [fatalError, stats] = args

  if (fatalError) {
    console.error('error', fatalError)
    return
  }

  const jsonStats = stats.toJson('verbose')
  const buildError = fatalError || jsonStats.errors[0] || jsonStats.warnings[0]

  if (buildError) {
    console.log('error', buildError)
  }

  console.log(
    stats.toString({
      assets: true,
      chunks: true,
      colors: true,
      hash: false,
      providedExports: true,
      maxModules: Infinity,
      hiddenModules: true,
      excludeModules: false,
      timings: true,
      usedExports: true,
      version: false,
    }),
  )

  Fs.writeFileSync('/tmp/stats.json', JSON.stringify(stats.toJson()))
}
