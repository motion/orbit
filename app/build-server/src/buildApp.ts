import { writeJSON } from 'fs-extra'
import { join } from 'path'
import Webpack from 'webpack'

import { makeWebpackConfig, WebpackParams } from './makeWebpackConfig'

export async function buildApp(appName: string, props: WebpackParams) {
  const outputDir = join(props.projectRoot, 'dist')

  let config = await makeWebpackConfig({
    ...props,
    entry: join(props.projectRoot, props.entry),
    mode: 'development',
    publicPath: '/',
    externals: {
      typeorm: 'typeorm',
    },
    ignore: ['electron-log'],
    outputDir,
    output: {
      library: appName,
      libraryTarget: 'umd',
    },
  })

  return new Promise((res, rej) => {
    Webpack(config, async (err, _stats) => {
      if (err) {
        rej(err)
        return
      }

      console.log('built', appName)

      await writeJSON(join(outputDir, 'buildInfo.json'), {
        built: Date.now(),
      })

      // console.log('done', err, stats.toString())
      if (!props.watch) {
        res()
      }
    })
  })
}
