import Webpack from 'webpack'

export async function webpackPromise(config: Webpack.Configuration) {
  return new Promise((res, rej) => {
    Webpack(config, async (err, _stats) => {
      if (err) {
        rej(err)
        return
      }
      if (!config.watch) {
        res()
      }
    })
  })
}
