import { writeJSON } from 'fs-extra'
import { join } from 'path'
import Webpack from 'webpack'

import { getAppConfig } from './getAppConfig'
import { WebpackParams } from './makeWebpackConfig'

export async function buildApp(props: WebpackParams) {
  const outputDir = join(props.context, 'dist')
  const config = await getAppConfig(props)

  return new Promise((res, rej) => {
    Webpack(config, async (err, _stats) => {
      if (err) {
        rej(err)
        return
      }

      console.log('built', err, props.name, _stats.toString())

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
