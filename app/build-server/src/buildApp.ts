import { join } from 'path'
import Webpack from 'webpack'

import { getAppConfig } from './getAppConfig'
import { WebpackParams } from './makeWebpackConfig'

export async function buildApp(props: WebpackParams) {
  const outputDir = join(props.context, 'dist')
  const config = await getAppConfig({
    ...props,
    outputDir,
  })

  return new Promise((res, rej) => {
    Webpack(config, async (err, _stats) => {
      if (err) {
        rej(err)
        return
      }
      if (!props.watch) {
        res(outputDir)
      }
    })
  })
}
