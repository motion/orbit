import Webpack from 'webpack'

export async function webpackPromise(
  configs: Webpack.Configuration[],
  options: { loud?: boolean } = { loud: false },
) {
  return new Promise((res, rej) => {
    Webpack(configs, async (err, stats) => {
      if (err) {
        rej(err)
        return
      }
      if (options.loud) {
        console.log(
          stats.toString({
            // make it a bit quieter
            chunks: false,
            builtAt: false,
            children: false,
            moduleTrace: false,

            colors: true,
          }),
        )
      }
      if (!configs.some(x => x.watch)) {
        res()
      } else {
        console.log('Webpack running in watch mode...')
      }
    })
  })
}
