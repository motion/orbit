import { Config } from './helpers/configureUI'

export const mediaQueryKeys = Object.keys(Config.mediaQueries)

export const hasMediaQueries = !!mediaQueryKeys.length

export const mediaQueryKeysSpace = mediaQueryKeys
  .map(key => `${key}-space`)
  .reduce((acc, cur) => {
    acc[cur] = true
    return acc
  }, {})

export const mediaQueryKeysSize = mediaQueryKeys
  .map(key => `${key}-size`)
  .reduce((acc, cur) => {
    acc[cur] = true
    return acc
  }, {})
