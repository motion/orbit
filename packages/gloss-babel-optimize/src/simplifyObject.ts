import { css } from '@o/css'

export function simplifyObject(node, t) {
  let finalObject = {}
  for (let i = 0; i < node.properties.length; i++) {
    let property = node.properties[i]

    if (
      !t.isObjectProperty(property) ||
      property.computed ||
      (!t.isIdentifier(property.key) && !t.isStringLiteral(property.key)) ||
      (!t.isStringLiteral(property.value) &&
        !t.isNumericLiteral(property.value) &&
        !t.isObjectExpression(property.value))
    ) {
      return node
    }

    let key = property.key.name || property.key.value
    if (key === 'styles') {
      return node
    }
    if (t.isObjectExpression(property.value)) {
      let simplifiedChild = simplifyObject(property.value, t)
      if (!t.isStringLiteral(simplifiedChild)) {
        return node
      }
      finalObject[key] = simplifiedChild.value
      continue
    }
    let value = property.value.value
    finalObject[key] = value
    // finalString += serializeStyles([{ [key]: value }]).styles
  }
  return css(finalObject)
}
