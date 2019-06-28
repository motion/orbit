import { Logger } from '@o/logger'
import webpack from 'webpack'

import { makeWebpackConfig, WebpackParams } from './makeWebpackConfig'

const log = new Logger('BuildServer.getAppConfig')

export function getAppConfig(props: WebpackParams, extraConfig?: Partial<webpack.Configuration>) {
  if (!props.entry.length) {
    log.info(`No entries for ${props.name}`)
    return null
  }
  return makeWebpackConfig(
    {
      mode: 'development',
      publicPath: '/',
      externals: {
        typeorm: 'typeorm',
      },
      ignore: ['electron-log', '@o/worker-kit'],
      output: {
        library: '[name]',
        libraryTarget: 'umd',
      },
      ...props,
    },
    extraConfig,
  )
}
