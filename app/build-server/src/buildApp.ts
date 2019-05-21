import { writeJSON } from 'fs-extra'
import { join } from 'path'
import Webpack from 'webpack'

import { getAppConfig } from './getAppConfig'
import { WebpackParams } from './makeWebpackConfig'

export type BuildAppProps = WebpackParams & {
  devServer?: boolean
}

export async function buildApp(appName: string, props: BuildAppProps) {
  const outputDir = join(props.projectRoot, 'dist')
  const config = await getAppConfig(appName, props)

  return new Promise((res, rej) => {
    Webpack(config, async (err, _stats) => {
      if (err) {
        rej(err)
        return
      }

      console.log('built', err, appName, _stats.toString())

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
