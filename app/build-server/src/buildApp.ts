import { join } from 'path'
import Webpack from 'webpack'

import { makeWebpackConfig, WebpackParams } from './makeWebpackConfig'

export async function buildApp(appName: string, props: WebpackParams) {
  console.log('should build app', props, require.resolve('webpack'))

  let config = await makeWebpackConfig({
    ...props,
    entry: join(props.projectRoot, props.entry),
    mode: 'development',
    publicPath: '/',
    externals: {
      typeorm: 'typeorm',
    },
    ignore: ['electron-log'],
    output: {
      library: appName,
      libraryTarget: 'umd',
    },
  })

  return new Promise(res => {
    Webpack(config, (err, stats) => {
      console.log('done', err, stats.toString())
      res()
    })
  })

  // TODO build into two bundles: node and js
  // so we can read node in orbit-desktop without loading entire app and then load the apis
}
