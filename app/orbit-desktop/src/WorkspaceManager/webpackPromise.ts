import Webpack from 'webpack'

export async function webpackPromise(
  configs: Webpack.Configuration[],
  options: { loud?: boolean } = { loud: false },
): Promise<Webpack.MultiWatching> {
  return new Promise((res, rej) => {
    const instance = Webpack(configs, async (err, stats) => {
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
            warnings: false,
            // children: false,
            moduleTrace: false,
            colors: true,
          }),
        )
      }
      if (!configs.some(x => x.watch)) {
        res(instance as Webpack.MultiWatching)
      } else {
        console.log('Webpack running in watch mode...')
      }
    })
  })
}
