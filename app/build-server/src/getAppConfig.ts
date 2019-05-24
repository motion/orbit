import { join } from 'path'

import { makeWebpackConfig, WebpackParams } from './makeWebpackConfig'

export async function getAppConfig(props: WebpackParams, extraConfig?: any) {
  const outputDir = join(props.context, 'dist')
  return await makeWebpackConfig(
    {
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
      ...props,
    },
    extraConfig,
  )
}
