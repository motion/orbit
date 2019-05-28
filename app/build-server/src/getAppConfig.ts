import { makeWebpackConfig, WebpackParams } from './makeWebpackConfig'

export function getAppConfig(props: WebpackParams, extraConfig?: any) {
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
