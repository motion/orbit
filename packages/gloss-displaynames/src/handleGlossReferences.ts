// import printAST from 'ast-pretty-print'
import nodePath from 'path'
import { looksLike } from './looksLike'

function handleGlossReferences(parentNode, references, file, babel) {
  const { types: t, template } = babel
  const buildBuiltInWithConfig = template(`
    IDENTIFIER.withConfig({displayName: "DISPLAY_NAME"})
  `)

  references.forEach(reference => {
    const displayName = getDisplayName(reference)
    handleComponent(reference, displayName)
  })

  function handleComponent(path, displayName) {
    const isViewed = looksLike(path, {
      parent: {
        callee: {
          name: 'view',
        },
      },
    })

    if (!isViewed) {
      return
    }

    let topPath = path
    while (topPath) {
      if (!topPath.parentPath || !topPath.parentPath.parentPath) {
        break
      }
      if (topPath.parentPath.parentPath.type === 'VariableDeclarator') {
        break
      } else {
        topPath = topPath.parentPath
      }
    }

    const isAssigned = looksLike(topPath, {
      parentPath: {
        type: 'CallExpression',
        parentPath: {
          type: 'VariableDeclarator',
        },
      },
    })

    if (!isAssigned) {
      return
    }

    parentNode.body.push(
      buildBuiltInWithConfig({
        IDENTIFIER: displayName,
        DISPLAY_NAME: displayName,
      }),
    )

    // topPath.replaceWith(
    //   buildBuiltInWithConfig({
    //     GLOSS: path.node,
    //     ARGUMENTS: path.parent.arguments,
    //     DISPLAY_NAME: t.stringLiteral(displayName),
    //   }),
    // )
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

export default handleGlossReferences
