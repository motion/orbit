const isIf = attribute =>
  attribute.type === 'JSXAttribute' && attribute.name.name === 'if'
const isntIf = x => !isIf(x)

module.exports = function JsxIf({ types: t }) {
  return {
    visitor: {
      JSXElement: {
        enter(path) {
          const { node } = path
          const attributes = node.openingElement.attributes
          if (!attributes) return
          const ifAttribute = attributes.filter(isIf)[0]
          if (ifAttribute) {
            const opening = t.JSXOpeningElement(
              node.openingElement.name,
              attributes.filter(isntIf),
            )
            const tag = t.JSXElement(
              opening,
              node.closingElement,
              node.children,
            )
            const conditional = t.conditionalExpression(
              ifAttribute.value.expression,
              tag,
              t.nullLiteral(),
            )
            path.replaceWith(conditional)
          }
        },
      },
    },
  }
}
