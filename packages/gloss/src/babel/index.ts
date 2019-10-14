import { PluginOptions } from '@babel/core'

import { BabelState } from '../types'
import { addDisplayName } from './addDisplayName'

export default function gloss(_context: any, options: PluginOptions) {
  return {
    plugins: [
      [
        glossPlugin,
        {
          displayName: true,
          ...options,
        },
      ],
    ],
  }
}

function glossPlugin(babel) {
  return {
    name: 'gloss-babel',
    visitor: {
      Program: {
        enter(path: any, state: BabelState) {
          // We need our transforms to run before anything else
          // So we traverse here instead of a in a visitor
          path.traverse(traverseGlossBlocks(babel, state))
        },
      },
    },
  }
}

function traverseGlossBlocks(babel, state: BabelState) {
  const references = new Set()
  return {
    ImportDeclaration(path) {
      const fileName = path.hub.file.opts.filename
      // options
      const matchNames: string[] = state.opts.matchNames || ['gloss']
      const matchImports: string[] = state.opts.matchImports || ['gloss']
      if (matchImports.indexOf(path.node.source.value) === -1) {
        return
      }
      const importSpecifiers = path.get('specifiers')
      const names: string[] = importSpecifiers.map(x => x.node.local.name)
      const glossFnName = matchNames.find(needle => names.indexOf(needle) !== -1)
      if (!glossFnName) return
      references.add(fileName)
      const paths = path.scope.getBinding(glossFnName).referencePaths
      // add display name
      addDisplayName(path, glossFnName, paths, state.file, babel)
    },
  }
}
