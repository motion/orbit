import Webpack from 'webpack'

type WebpackDesc =
  | { type: 'watch'; compiler: Webpack.MultiWatching }
  | { type: 'build'; compiler: Webpack.MultiCompiler }

export async function webpackPromise(
  configs: Webpack.Configuration[],
  options: { loud?: boolean } = { loud: false },
): Promise<WebpackDesc> {
  return new Promise((res, rej) => {
    const compiler = Webpack(configs, async (err, stats) => {
      if (err) {
        rej(err)
        return
      }
      if (options.loud) {
        console.log(
          stats.toString({
            chunks: false,
            builtAt: false,
            warnings: false,
            moduleTrace: false,
            colors: true,
            // LOG ALL
            all: +process.env.LOG_LEVEL > 4,
          }),
        )
      }
      res({
        type: configs.some(x => x.watch) ? 'watch' : 'build',
        compiler: compiler as any,
      })
    })
  })
}
