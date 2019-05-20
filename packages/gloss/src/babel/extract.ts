import { BabelState } from '../types'
import { handleGlossReferences } from './handleGlossReferences'
import { Module } from './Module'

export default function glossExtract(babel) {
  return {
    name: 'gloss-babel',
    visitor: {
      Program: {
        enter(path: any, state: BabelState) {
          // Collect all the style rules from the styles we encounter
          state.rules = {}
          state.index = -1
          state.dependencies = []
          state.replacements = []

          // Invalidate cache for module evaluation to get fresh modules
          Module.invalidate()

          // We need our transforms to run before anything else
          // So we traverse here instead of a in a visitor
          path.traverse(parseBabelStyles(babel, state))
        },
        exit(_path: any, state: BabelState) {
          if (Object.keys(state.rules).length) {
            // Store the result as the file metadata
            state.file.metadata = {
              gloss: {
                rules: state.rules,
                replacements: state.replacements,
                dependencies: state.dependencies,
              },
            }
          }

          // Invalidate cache for module evaluation when we're done
          Module.invalidate()
        },
      },
    },
  }
}

function parseBabelStyles(babel, state: BabelState) {
  const references = new Set()
  return {
    ImportDeclaration(path) {
      const fileName = path.hub.file.opts.filename

      // why does babel try and process every file so many times?
      if (references.has(fileName)) {
        return
      }

      // options
      const matchNames: string[] = state.opts.matchNames || ['gloss']
      const matchImports: string[] = state.opts.matchImports || ['gloss']

      if (matchImports.indexOf(path.node.source.value) === -1) {
        return
      }

      const importSpecifiers = path.get('specifiers')
      const names: string[] = importSpecifiers.map(x => x.node.local.name)
      const name = matchNames.find(needle => names.indexOf(needle) !== -1)

      if (!name) return

      references.add(fileName)
      const paths = path.scope.getBinding(name).referencePaths
      const rules = handleGlossReferences(path.node, name, paths, babel)
      state.rules = rules
    },
  }
}
