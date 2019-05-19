import { join } from 'path'
import Webpack from 'webpack'

import { makeWebpackConfig } from './makeWebpackConfig'

export async function buildApp(projectRoot: string, entry: string) {
  console.log('should build app', projectRoot)

  let config = await makeWebpackConfig({
    projectRoot,
    mode: 'development',
    publicPath: '/',
    target: 'node',
    entry: join(projectRoot, entry),
  })

  Webpack(config, (err, stats) => {
    console.log('done', err, stats.toString())
  })

  // TODO build into two bundles: node and js
  // so we can read node in orbit-desktop without loading entire app and then load the apis
}
