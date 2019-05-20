import nodePath from 'path'

import { isGlossView } from './utils'

export function addDisplayName(parentNode, _name, references, file, babel) {
  const { types: t, template } = babel
  // extra safe because babel or webpack or something can leave behind old ones of these
  const buildBuiltInWithConfig = template(`
  typeof IDENTIFIER !== 'undefined' && IDENTIFIER.withConfig && IDENTIFIER.withConfig({displayName: "DISPLAY_NAME"})
  `)

  for (const reference of references) {
    const displayName = getDisplayName(reference)
    if (!isGlossView(displayName, reference)) continue
    parentNode.body.push(
      buildBuiltInWithConfig({
        IDENTIFIER: displayName,
        DISPLAY_NAME: displayName,
      }),
    )
  }

  // credit: https://github.com/styled-components/babel-plugin-styled-components/blob/37a13e9c21c52148ce6e403100df54c0b1561a88/src/visitors/displayNameAndId.js
  function getDisplayName(path) {
    const componentName = getName(path)
    const filename = getFileName(file)
    if (filename) {
      if (filename === componentName) {
        return componentName
      }
      return componentName ? `${filename}__${componentName}` : filename
    } else {
      return componentName
    }
  }

  // credit: https://github.com/styled-components/babel-plugin-styled-components/blob/37a13e9c21c52148ce6e403100df54c0b1561a88/src/utils/getName.js
  function getName(path) {
    let namedNode
    path.find(parentPath => {
      if (parentPath.isObjectProperty()) {
        // const X = { Y: glamorous }
        namedNode = parentPath.node.key
      } else if (parentPath.isVariableDeclarator()) {
        // let X; X = glamorous
        namedNode = parentPath.node.id
      } else if (parentPath.isStatement()) {
        // we've hit a statement, we should stop crawling up
        return true
      }
      // we've got an displayName (if we need it) no need to continue
      if (namedNode) {
        return true
      }
      return false
    })
    // identifiers are the only thing we can reliably get a name from
    return t.isIdentifier(namedNode) ? namedNode.name : undefined
  }
}

function getFileName(file) {
  if (!file || file.opts.filename === 'unknown') {
    return ''
  }
  return file.opts.basename === 'index'
    ? nodePath.basename(nodePath.dirname(file.opts.filename))
    : file.opts.basename
}
