import { Logger } from '@o/logger'

import { WebpackParams } from './makeWebpackConfig'

const log = new Logger('BuildServer.getAppConfig')

export function getAppConfig(props: WebpackParams): WebpackParams {
  if (!props.entry.length) {
    log.info(`No entries for ${props.name}`)
    return null
  }
  return {
    mode: 'development',
    publicPath: '/',
    externals: {
      typeorm: 'typeorm',
    },
    ignore: ['electron-log', '@o/worker-kit'],
    ...props,
    output: {
      library: '[name]',
      libraryTarget: 'umd',
      ...props.output,
    },
  }
}
