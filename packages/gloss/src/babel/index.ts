import { PluginOptions } from '@babel/core'

import { loadOptions } from './loadOptions'

export default function gloss(_context: any, options: PluginOptions) {
  return {
    plugins: [[require('./extract'), loadOptions(options as any)]],
  }
}
