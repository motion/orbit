import { simplifyObject } from '../simplifyObject'

export function handleGlossReferences(parentNode, name, references, file, babel) {
  const { types: t } = babel

  console.log('references', references.length)

  references.forEach(reference => {
    handleComponent(reference)
  })

  parentNode
  file

  function handleComponent(path) {
    if (!isGlossView(name, path)) {
      return
    }
    const css = getCSS(path.parentPath)
    console.log('css', css)
  }

  function getCSS(path) {
    const x = path.get('arguments')

    x.forEach(node => {
      if (!node.isPure()) return
      if (t.isObjectExpression(node)) {
        const className = simplifyObject(node.node, t)
        node.replaceWith(
          t.objectExpExpression([
            t.objectProperty(t.identifier('className'), t.stringLiteral(className)),
          ]),
        )
      }
    })

    return ''
  }
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
