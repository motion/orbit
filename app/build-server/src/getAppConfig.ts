import { makeWebpackConfig, WebpackParams } from './makeWebpackConfig'

export async function getAppConfig(props: WebpackParams, extraConfig?: any) {
  return await makeWebpackConfig(
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
