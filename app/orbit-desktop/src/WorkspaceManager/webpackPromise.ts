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
        const logLevel = +process.env.LOG_LEVEL
        if (logLevel > 1) {
          console.log(
            stats.toString(
              logLevel > 4
                ? { all: true }
                : {
                    chunks: false,
                    builtAt: false,
                    warnings: false,
                    moduleTrace: false,
                    colors: true,
                  },
            ),
          )
        }
      }
      res({
        type: configs.some(x => x.watch) ? 'watch' : 'build',
        compiler: compiler as any,
      })
    })
  })
}
