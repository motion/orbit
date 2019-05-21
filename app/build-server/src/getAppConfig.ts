import { join } from 'path'

import { BuildAppProps } from './buildApp'
import { makeWebpackConfig } from './makeWebpackConfig'

export async function getAppConfig(appName: string, props: BuildAppProps) {
  const outputDir = join(props.projectRoot, 'dist')

  const devServerOpts = {
    devServer: {
      clientLogLevel: 'error',
      stats: true,
      historyApiFallback: true,
      hot: true,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    },
  }

  return await makeWebpackConfig({
    ...props,
    ...(props.devServer && devServerOpts),
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
}
