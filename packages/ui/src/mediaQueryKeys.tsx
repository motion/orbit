import { Config } from './helpers/configureUI'

const mediaQueryKeys = Object.keys(Config.mediaQueries)

export const hasMediaQueries = !!mediaQueryKeys.length
export const spaceMediaQueryKeys = mediaQueryKeys
  .map(key => `${key}-space`)
  .reduce((acc, cur) => {
    acc[cur] = true
    return acc
  }, {})
export const sizeMediaQueryKeys = mediaQueryKeys
  .map(key => `${key}-size`)
  .reduce((acc, cur) => {
    acc[cur] = true
    return acc
  }, {})
