import { types as t } from '@babel/core'
import annotateAsPure from '@babel/helper-annotate-as-pure'
import { declare } from '@babel/helper-plugin-utils'

export default declare((api, options) => {
  api.assertVersion(7)

  const { allowMutablePropsOnTags } = options

  const HOISTED = new WeakSet()

  const immutabilityVisitor = {
    enter(path, state) {
      const stop = () => {
        state.isImmutable = false
        path.stop()
      }

      if (path.isJSXClosingElement()) {
        path.skip()
        return
      }

      // Elements with refs are not safe to hoist.
      if (
        path.isJSXIdentifier({ name: 'ref' }) &&
        path.parentPath.isJSXAttribute({ name: path.node })
      ) {
        return stop()
      }

      // Ignore identifiers & JSX expressions.
      if (path.isJSXIdentifier() || path.isIdentifier() || path.isJSXMemberExpression()) {
        return
      }

      if (!path.isImmutable()) {
        // If it's not immutable, it may still be a pure expression, such as string concatenation.
        // It is still safe to hoist that, so long as its result is immutable.
        // If not, it is not safe to replace as mutable values (like objects) could be mutated after render.
        // https://github.com/facebook/react/issues/3226
        if (path.isPure()) {
          const expressionResult = path.evaluate()
          if (expressionResult.confident) {
            // We know the result; check its mutability.
            const { value } = expressionResult
            const isMutable =
              (!state.mutablePropsAllowed && (value && typeof value === 'object')) ||
              typeof value === 'function'
            if (!isMutable) {
              // It evaluated to an immutable value, so we can hoist it.
              path.skip()
              return
            }
          } else if (t.isIdentifier(expressionResult.deopt)) {
            // It's safe to hoist here if the deopt reason is an identifier (e.g. func param).
            // The hoister will take care of how high up it can be hoisted.
            return
          }
        }
        stop()
      }
    },
  }

  let IMPORTS = []
  let hasExited = false

  return {
    name: 'transform-react-constant-elements',

    visitor: {
      // remove imports before to stop bug
      ImportDeclaration(path) {
        // exit check because otherwise you run into: https://github.com/babel/babel/issues/8270
        if (!hasExited) {
          IMPORTS.push(path.node)
          path.remove()
        }
      },

      // then insert them back in after
      Program: {
        enter() {
          hasExited = false
          IMPORTS = []
        },

        exit(path) {
          hasExited = true
          path.node.body = [...IMPORTS, ...path.node.body]
        },
      },

      JSXElement(path) {
        if (HOISTED.has(path.node)) return
        HOISTED.add(path.node)

        const state: any = { isImmutable: true }

        // This transform takes the option `allowMutablePropsOnTags`, which is an array
        // of JSX tags to allow mutable props (such as objects, functions) on. Use sparingly
        // and only on tags you know will never modify their own props.
        if (allowMutablePropsOnTags) {
          // Get the element's name. If it's a member expression, we use the last part of the path.
          // So the option ["FormattedMessage"] would match "Intl.FormattedMessage".
          let namePath = path.get('openingElement.name')
          while (namePath.isJSXMemberExpression()) {
            namePath = namePath.get('property')
          }

          const elementName = namePath.node.name
          state.mutablePropsAllowed = Array.isArray(allowMutablePropsOnTags)
            ? allowMutablePropsOnTags.indexOf(elementName) > -1
            : true
        }

        // Traverse all props passed to this element for immutability.
        path.traverse(immutabilityVisitor, state)

        if (state.isImmutable) {
          const hoisted = path.hoist()

          if (hoisted) {
            annotateAsPure(hoisted)
          }
        }
      },
    },
  }
})
