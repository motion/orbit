import { join } from 'path'
import Webpack from 'webpack'

import { makeWebpackConfig, WebpackParams } from './makeWebpackConfig'

export async function buildApp(props: WebpackParams) {
  console.log('should build app', props)

  let config = await makeWebpackConfig({
    ...props,
    entry: join(props.projectRoot, props.entry),
    mode: 'development',
    publicPath: '/',
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
