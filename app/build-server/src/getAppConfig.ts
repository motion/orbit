import { join } from 'path'

import { makeWebpackConfig, WebpackParams } from './makeWebpackConfig'

export async function getAppConfig(appName: string, props: WebpackParams) {
  const outputDir = join(props.projectRoot, 'dist')

  return await makeWebpackConfig(appName, {
    ...props,
    mode: 'development',
    publicPath: '/',
    externals: {
      typeorm: 'typeorm',
    },
    ignore: ['electron-log'],
    outputDir,
    output: {
      library: '[name]',
      libraryTarget: 'umd',
    },
  })
}
