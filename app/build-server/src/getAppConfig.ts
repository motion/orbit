import { makeWebpackConfig, WebpackParams } from './makeWebpackConfig'
import webpack = require('webpack')

export function getAppConfig(props: WebpackParams, extraConfig?: Partial<webpack.Configuration>) {
  return makeWebpackConfig(
    {
      mode: 'development',
      publicPath: '/',
      externals: {
        typeorm: 'typeorm',
      },
      ignore: ['electron-log'],
      output: {
        library: '[name]',
        libraryTarget: 'umd',
      },
      ...props,
    },
    extraConfig,
  )
}
