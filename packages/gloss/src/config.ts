import { ViewOptions } from './types'
import { colorToString } from './gloss'

export let Config: ViewOptions = {
  glossProp: 'css',
  isColor: color => color && !!color.rgb,
  toColor: colorToString,
}

export function configureView(options: ViewOptions) {
  Config = {
    ...Config,
    ...options,
  }
  // prevent multiple configuration
  Object.freeze(Config)
}
