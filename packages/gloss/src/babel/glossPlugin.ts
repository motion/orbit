import { styleToClassName } from '@o/css'

import { simplifyObject } from '../simplifyObject'
import { BabelState } from '../types'
import { addDisplayName } from './addDisplayName'
import { Module } from './Module'
import { isGlossView } from './utils'

export default function glossPlugin(babel) {
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
          path.traverse(traverseGlossBlocks(babel, state))
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
      // extract static styles
      // TODO @nate need to finish this
      if (false) {
        const rules = extractStyles(path.node, glossFnName, paths, babel)
        state.rules = rules
      }
      // add display name
      addDisplayName(path, glossFnName, paths, state.file, babel)
    },
  }
}

function extractStyles(parentNode, name, references, babel): BabelState['rules'] {
  const { types: t } = babel
  const rules = {}
  for (const path of references) {
    if (!isGlossView(name, path)) continue
    const start = parentNode && parentNode.loc ? parentNode.loc.start : null
    const args = path.parentPath.get('arguments')
    for (const node of args) {
      if (!node.isPure()) continue
      if (!t.isObjectExpression(node)) continue
      const cssText = simplifyObject(node.node, t)
      const className = styleToClassName(cssText)
      node.replaceWith(
        t.objectExpression([
          t.objectProperty(t.identifier('className'), t.stringLiteral(className)),
        ]),
      )
      rules[`.${className}`] = {
        cssText,
        className,
        start,
      }
    }
  }
  return rules
}
