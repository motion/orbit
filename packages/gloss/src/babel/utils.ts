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

export function isGlossView(name: string, path) {
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
