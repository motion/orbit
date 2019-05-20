import { styleToClassName } from '@o/css'

import { simplifyObject } from '../simplifyObject'
import { BabelState } from '../types'

export function handleGlossReferences(parentNode, name, references, babel): BabelState['rules'] {
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

export function looksLike(a, b) {
  return (
    a &&
    b &&
    Object.keys(b).every(bKey => {
      const bVal = b[bKey]
      const aVal = a[bKey]
      if (typeof bVal === 'function') {
        return bVal(aVal)
      }
      return isPrimitive(bVal) ? bVal === aVal : looksLike(aVal, bVal)
    })
  )
}

function isPrimitive(val) {
  return val == null || /^[sbn]/.test(typeof val)
}

function isGlossView(name, path) {
  const calledByGloss = looksLike(path, {
    parent: {
      callee: {
        name,
      },
    },
  })

  if (!calledByGloss) {
    return false
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
    return false
  }

  return true
}
