import { PluginOptions } from '@babel/core'

import glossPlugin from './glossPlugin'
import { loadOptions } from './loadOptions'

export default function gloss(_context: any, options: PluginOptions) {
  return {
    plugins: [[glossPlugin, loadOptions(options as any)]],
  }
}
