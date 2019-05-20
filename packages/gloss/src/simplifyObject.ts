import { cssString } from '@o/css'

export function simplifyObject(node, t) {
  try {
    let object = astToObject(node, t)
    let css = cssString(object)
    return css
  } catch (err) {
    if (err instanceof NotSimpleObjectError) {
      console.error('Not a simple object, cant simplify')
      return node
    } else {
      throw err
    }
  }
}

class NotSimpleObjectError extends Error {}

const isSimpleValue = (x, t) => {
  return t.isIdentifier(x) || t.isStringLiteral(x) || t.isNumericLiteral(x)
}

function astToObject(node: any, t) {
  let obj = {}
  for (let i = 0; i < node.properties.length; i++) {
    let property = node.properties[i]

    if (!isSimpleValue(property.key, t)) {
      throw new NotSimpleObjectError()
    }

    let key = property.key.name || property.key.value

    if (t.isObjectExpression(property.value)) {
      obj[key] = astToObject(property.value, t)
      continue
    }
    if (t.isArrayExpression(property.value)) {
      obj[key] = astToArray(property.value, t)
      continue
    }
    obj[key] = property.value.value
  }
  return obj
}

function astToArray(x, t) {
  let arr: any[] = []
  for (const el of x.elements) {
    if (t.isObjectExpression(el)) {
      arr.push(astToObject(el, t))
      continue
    }
    if (t.isArrayExpression(el)) {
      arr.push(astToArray(el, t))
      continue
    }
    if (!isSimpleValue(el, t)) {
      throw new NotSimpleObjectError()
    }
    arr.push(el.value)
  }
  return arr
}
