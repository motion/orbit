export default function({ types: t }) {
  // convert React.createElement() => this.glossElement()

  const classBodyVisitor = {
    ClassMethod(path) {
      // add a fancyelement hook to start of render
      if (path.node.kind === 'constructor') {
        return
      }
      if (path.node.body.body && !path.node.body.glossHasVisited) {
        path.node.body.glossHasVisited = true
        path.node.body.body.unshift(
          t.variableDeclaration('const', [
            t.variableDeclarator(
              t.identifier('__dom'),
              t.identifier(
                'this.glossElement && this.glossElement.bind(this) || window.__dom',
              ),
            ),
          ]),
        )
      }
    },
  }

  const programVisitor = {
    Class(path, state) {
      const node = path.node
      if (!node.decorators || !node.decorators.length) {
        return
      }
      // -- Validate if class is what we're looking for
      //    has some flexibility, looks for any of:
      //       @x  @x()  @x.y  @x.y()

      const decoratorName = (state.opts && state.opts.decoratorName) || 'style'

      const foundDecorator = node.decorators.some(item => {
        // babel 7 style
        if (item.callee) {
          if (item.callee.name === decoratorName) {
            return true
          }
          if (
            t.isCallExpression(item.callee) &&
            item.callee.callee.name === decoratorName
          ) {
            return true
          }
          if (
            t.isMemberExpression(item.callee) &&
            item.callee.object.name === decoratorName
          ) {
            return true
          }
          return
        }
        // babel 6 style
        if (!item.expression) {
          return false
        }
        // @style
        if (
          item.expression.type === 'Identifier' &&
          item.expression.name === decoratorName
        ) {
          return true
        }
        // @style()
        if (
          item.expression.callee &&
          item.expression.callee.name === decoratorName
        ) {
          return true
        }
        // @style.something()
        if (
          item.expression.callee &&
          t.isMemberExpression(item.expression.callee) &&
          item.expression.callee.object.name === decoratorName
        ) {
          return true
        }
        // @style.something
        if (
          item.expression.object &&
          item.expression.object.name === decoratorName
        ) {
          return true
        }

        return false
      })

      // -- Add a unique var to scope and all of JSX elements
      if (foundDecorator) {
        path.traverse(classBodyVisitor, state)
      }
    },
  }

  return {
    visitor: {
      Program(path, state) {
        path.traverse(programVisitor, state)
      },
    },
  }
}
