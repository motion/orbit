import generate from '@babel/generator'
import traverse, { VisitNodeObject } from '@babel/traverse'
import t = require('@babel/types')
import { getStylesClassName, GlossView } from 'gloss'
import invariant = require('invariant')
import path = require('path')
import util = require('util')
import vm = require('vm')

import { CacheObject } from '../../types'
import { getStylesByClassName } from '../getStylesByClassName'
import { evaluateAstNode } from './evaluateAstNode'
import { Ternary } from './extractStaticTernaries'
import { getStaticBindingsForScope } from './getStaticBindingsForScope'
import { parse } from './parse'

export interface ExtractStylesOptions {
  views: {
    [key: string]: GlossView<any>
  }
}

export interface Options {
  cacheObject: CacheObject
  errorCallback?: (str: string, ...args: any[]) => void
  warnCallback?: (str: string, ...args: any[]) => void
}

interface TraversePath<TNode = any> {
  node: TNode
  scope: {} // TODO
  _complexComponentProp?: any // t.VariableDeclarator;
  parentPath: TraversePath<any>
  insertBefore: (arg: t.Node) => void
}

// props that will be passed through as-is
const UNTOUCHED_PROPS = {
  key: true,
  style: true,
}

const JSXSTYLE_SOURCES = {
  '@o/ui': true,
  '@o/ui/test': true,
}

const JSX_VALID_NAMES = ['View', 'Col', 'Row', 'Grid']

export function extractStyles(
  src: string | Buffer,
  sourceFileName: string,
  { cacheObject, warnCallback, errorCallback }: Options,
  options: ExtractStylesOptions,
): {
  js: string | Buffer
  css: string
  cssFileName: string | null
  ast: t.File
  map: any // RawSourceMap from 'source-map'
} {
  if (typeof src !== 'string') {
    throw new Error('`src` must be a string of javascript')
  }

  invariant(
    typeof sourceFileName === 'string' && path.isAbsolute(sourceFileName),
    '`sourceFileName` must be an absolute path to a .js file',
  )

  invariant(
    typeof cacheObject === 'object' && cacheObject !== null,
    '`cacheObject` must be an object',
  )

  let logWarning = console.warn
  if (typeof warnCallback !== 'undefined') {
    invariant(typeof warnCallback === 'function', '`warnCallback` is expected to be a function')
    logWarning = warnCallback
  }

  let logError = console.error
  if (typeof errorCallback !== 'undefined') {
    invariant(typeof errorCallback === 'function', '`errorCallback` is expected to be a function')
    logError = errorCallback
  }

  const sourceDir = path.dirname(sourceFileName)

  // Using a map for (officially supported) guaranteed insertion order
  const cssMap = new Map<string, { css: string; commentTexts: string[] }>()

  const ast = parse(src)

  let jsxstyleSrc: string | null = null
  const validComponents = {}
  // default to using require syntax
  let useImportSyntax = false
  let hasValidComponents = false

  // Find jsxstyle require in program root
  ast.program.body = ast.program.body.filter((item: t.Node) => {
    if (t.isImportDeclaration(item)) {
      // not imported from jsxstyle? byeeee
      if (!JSXSTYLE_SOURCES.hasOwnProperty(item.source.value)) {
        return true
      }

      if (jsxstyleSrc) {
        invariant(
          jsxstyleSrc === item.source.value,
          'Expected duplicate `import` to be from "%s", received "%s"',
          jsxstyleSrc,
          item.source.value,
        )
      }

      jsxstyleSrc = item.source.value
      useImportSyntax = true

      item.specifiers = item.specifiers.filter(specifier => {
        // keep the weird stuff
        if (
          !t.isImportSpecifier(specifier) ||
          !t.isIdentifier(specifier.imported) ||
          !t.isIdentifier(specifier.local)
        ) {
          return true
        }

        if (specifier.local.name[0] !== specifier.local.name[0].toUpperCase()) {
          return true
        }

        if (!JSX_VALID_NAMES.includes(specifier.local.name)) {
          return true
        }

        validComponents[specifier.local.name] = specifier.imported.name
        hasValidComponents = true
        // dont remove the import
        return true
      })

      // remove import
      // if (item.specifiers.length === 0) {
      //   return false
      // }
    }

    return true
  })

  // jsxstyle isn't included anywhere, so let's bail
  if (jsxstyleSrc == null || !hasValidComponents) {
    return {
      ast,
      css: '',
      cssFileName: null,
      js: src,
      map: null,
    }
  }

  // class or className?
  const classPropName = 'className'

  // per-file cache of evaluated bindings
  const bindingCache = {}

  const traverseOptions: { JSXElement: VisitNodeObject<t.JSXElement, any> } = {
    JSXElement: {
      enter(traversePath: TraversePath<t.JSXElement>) {
        const node = traversePath.node.openingElement

        if (
          // skip non-identifier opening elements (member expressions, etc.)
          !t.isJSXIdentifier(node.name) ||
          // skip non-jsxstyle components
          !validComponents.hasOwnProperty(node.name.name)
        ) {
          return
        }

        // Remember the source component
        const originalNodeName = node.name.name

        // evaluateVars = false
        const attemptEval = !false
          ? evaluateAstNode
          : (() => {
              // Generate scope object at this level
              const staticNamespace = getStaticBindingsForScope(
                traversePath.scope,
                sourceFileName,
                bindingCache,
              )

              const evalContext = vm.createContext(staticNamespace)

              // called when evaluateAstNode encounters a dynamic-looking prop
              const evalFn = (n: t.Node) => {
                // variable
                if (t.isIdentifier(n)) {
                  invariant(
                    staticNamespace.hasOwnProperty(n.name),
                    'identifier not in staticNamespace',
                  )
                  return staticNamespace[n.name]
                }
                return vm.runInContext(`(${generate(n).code})`, evalContext)
              }

              return (n: t.Node) => evaluateAstNode(n, evalFn)
            })()

        let lastSpreadIndex: number = -1
        const flattenedAttributes: (t.JSXAttribute | t.JSXSpreadAttribute)[] = []
        node.attributes.forEach(attr => {
          if (t.isJSXSpreadAttribute(attr)) {
            try {
              const spreadValue = attemptEval(attr.argument)

              if (typeof spreadValue !== 'object' || spreadValue == null) {
                lastSpreadIndex = flattenedAttributes.push(attr) - 1
              } else {
                for (const k in spreadValue) {
                  const value = spreadValue[k]

                  if (typeof value === 'number') {
                    flattenedAttributes.push(
                      t.jsxAttribute(
                        t.jsxIdentifier(k),
                        t.jsxExpressionContainer(t.numericLiteral(value)),
                      ),
                    )
                  } else if (value === null) {
                    // why would you ever do this
                    flattenedAttributes.push(
                      t.jsxAttribute(t.jsxIdentifier(k), t.jsxExpressionContainer(t.nullLiteral())),
                    )
                  } else {
                    // toString anything else
                    // TODO: is this a bad idea
                    flattenedAttributes.push(
                      t.jsxAttribute(
                        t.jsxIdentifier(k),
                        t.jsxExpressionContainer(t.stringLiteral('' + value)),
                      ),
                    )
                  }
                }
              }
            } catch (e) {
              lastSpreadIndex = flattenedAttributes.push(attr) - 1
            }
          } else {
            flattenedAttributes.push(attr)
          }
        })

        node.attributes = flattenedAttributes

        let propsAttributes: (t.JSXSpreadAttribute | t.JSXAttribute)[] = []
        const staticAttributes: Record<string, any> = {}
        let inlinePropCount = 0
        const staticTernaries: Ternary[] = []

        node.attributes = node.attributes.filter((attribute, idx) => {
          if (
            t.isJSXSpreadAttribute(attribute) ||
            // keep the weirdos
            !attribute.name ||
            // filter out JSXIdentifiers
            typeof attribute.name.name !== 'string' ||
            // haven't hit the last spread operator
            idx < lastSpreadIndex
          ) {
            inlinePropCount++
            return true
          }

          const name = attribute.name.name
          const value =
            attribute.value && t.isJSXExpressionContainer(attribute.value)
              ? attribute.value.expression
              : attribute.value

          if (!value) {
            logWarning('`%s` prop does not have a value', name)
            inlinePropCount++
            return true
          }

          // if one or more spread operators are present and we haven't hit the last one yet, the prop stays inline
          if (lastSpreadIndex > -1 && idx <= lastSpreadIndex) {
            inlinePropCount++
            return true
          }

          // pass ref, key, and style props through untouched
          if (UNTOUCHED_PROPS.hasOwnProperty(name)) {
            return true
          }

          // className prop will be handled below
          if (name === classPropName) {
            return true
          }

          if (name === 'ref') {
            logWarning(
              'The `ref` prop cannot be extracted from a jsxstyle component. ' +
                'If you want to attach a ref to the underlying component ' +
                'or element, specify a `ref` property in the `props` object.',
            )
            inlinePropCount++
            return true
          }

          // pass key and style props through untouched
          if (UNTOUCHED_PROPS.hasOwnProperty(name)) {
            return true
          }

          // if value can be evaluated, extract it and filter it out
          try {
            staticAttributes[name] = attemptEval(value)
            return false
          } catch (e) {
            //
          }

          if (t.isConditionalExpression(value)) {
            // if both sides of the ternary can be evaluated, extract them
            try {
              const consequent = attemptEval(value.consequent)
              const alternate = attemptEval(value.alternate)

              staticTernaries.push({
                alternate,
                consequent,
                name,
                test: value.test,
              })
              // mark the prop as extracted
              staticAttributes[name] = null
              return false
            } catch (e) {
              //
            }
          } else if (t.isLogicalExpression(value)) {
            // convert a simple logical expression to a ternary with a null alternate
            if (value.operator === '&&') {
              try {
                const consequent = attemptEval(value.right)
                staticTernaries.push({
                  alternate: null,
                  consequent,
                  name,
                  test: value.left,
                })
                staticAttributes[name] = null
                return false
              } catch (e) {
                //
              }
            }
          }

          // if we've made it this far, the prop stays inline
          inlinePropCount++
          return true
        })

        let classNamePropValue: t.Expression | null = null

        // const classNamePropIndex = node.attributes.findIndex(
        //   attr => !t.isJSXSpreadAttribute(attr) && attr.name && attr.name.name === classPropName,
        // )
        // if (classNamePropIndex > -1 && Object.keys(staticAttributes).length > 0) {
        //   classNamePropValue = getPropValueFromAttributes(classPropName, node.attributes)
        //   node.attributes.splice(classNamePropIndex, 1)
        // }

        // if all style props have been extracted, jsxstyle component can be
        // converted to a div or the specified component
        if (inlinePropCount === 0) {
          // TODO we can do this but we'd need a slightly different strategy:
          //  Config needs to know how to parse the components.... so we'd need like a way to
          //  take View and run it, get the classnames, and return the div here
          //  because View may add more styles on top
          // node.name.name = 'div'
        } else {
          if (lastSpreadIndex > -1) {
            // if only some style props were extracted AND additional props are spread onto the component,
            // add the props back with null values to prevent spread props from incorrectly overwriting the extracted prop value
            Object.keys(staticAttributes).forEach(attr => {
              node.attributes.push(
                t.jsxAttribute(t.jsxIdentifier(attr), t.jsxExpressionContainer(t.nullLiteral())),
              )
            })
          }
        }

        const stylesByClassName = getStylesByClassName(staticAttributes, cacheObject)
        const extractedStyleClassNames = Object.keys(stylesByClassName).join(' ')
        const classNameObjects: (t.StringLiteral | t.Expression)[] = []

        if (classNamePropValue) {
          try {
            const evaluatedValue = attemptEval(classNamePropValue)
            classNameObjects.push(t.stringLiteral(evaluatedValue))
          } catch (e) {
            classNameObjects.push(classNamePropValue)
          }
        }

        // if (staticTernaries.length > 0) {
        //   const ternaryObj = extractStaticTernaries(staticTernaries, cacheObject)

        //   // ternaryObj is null if all of the extracted ternaries have falsey consequents and alternates
        //   if (ternaryObj !== null) {
        //     // add extracted styles by className to existing object
        //     Object.assign(stylesByClassName, ternaryObj.stylesByClassName)
        //     classNameObjects.push(ternaryObj.ternaryExpression)
        //   }
        // }

        if (extractedStyleClassNames) {
          classNameObjects.push(t.stringLiteral(extractedStyleClassNames))
        }

        const classNamePropValueForReals = classNameObjects.reduce<t.Expression | null>(
          (acc, val) => {
            if (acc == null) {
              if (
                // pass conditional expressions through
                t.isConditionalExpression(val) ||
                // pass non-null literals through
                t.isStringLiteral(val) ||
                t.isNumericLiteral(val)
              ) {
                return val
              }
              return t.logicalExpression('||', val, t.stringLiteral(''))
            }

            let inner: t.Expression
            if (t.isStringLiteral(val)) {
              if (t.isStringLiteral(acc)) {
                // join adjacent string literals
                return t.stringLiteral(`${acc.value} ${val.value}`)
              }
              inner = t.stringLiteral(` ${val.value}`)
            } else if (t.isLiteral(val)) {
              inner = t.binaryExpression('+', t.stringLiteral(' '), val)
            } else if (t.isConditionalExpression(val) || t.isBinaryExpression(val)) {
              if (t.isStringLiteral(acc)) {
                return t.binaryExpression('+', t.stringLiteral(`${acc.value} `), val)
              }
              inner = t.binaryExpression('+', t.stringLiteral(' '), val)
            } else if (t.isIdentifier(val) || t.isMemberExpression(val)) {
              // identifiers and member expressions make for reasonable ternaries
              inner = t.conditionalExpression(
                val,
                t.binaryExpression('+', t.stringLiteral(' '), val),
                t.stringLiteral(''),
              )
            } else {
              if (t.isStringLiteral(acc)) {
                return t.binaryExpression(
                  '+',
                  t.stringLiteral(`${acc.value} `),
                  t.logicalExpression('||', val, t.stringLiteral('')),
                )
              }
              // use a logical expression for more complex prop values
              inner = t.binaryExpression(
                '+',
                t.stringLiteral(' '),
                t.logicalExpression('||', val, t.stringLiteral('')),
              )
            }
            return t.binaryExpression('+', acc, inner)
          },
          null,
        )

        if (classNamePropValueForReals) {
          if (t.isStringLiteral(classNamePropValueForReals)) {
            node.attributes.push(
              t.jsxAttribute(
                t.jsxIdentifier(classPropName),
                t.stringLiteral(classNamePropValueForReals.value),
              ),
            )
          } else {
            node.attributes.push(
              t.jsxAttribute(
                t.jsxIdentifier(classPropName),
                t.jsxExpressionContainer(classNamePropValueForReals),
              ),
            )
          }
        }

        const lineNumbers =
          node.loc &&
          node.loc.start.line +
            (node.loc.start.line !== node.loc.end.line ? `-${node.loc.end.line}` : '')

        const comment = util.format(
          '/* %s:%s (%s) */',
          sourceFileName.replace(process.cwd(), '.'),
          lineNumbers,
          originalNodeName,
        )

        for (const className in stylesByClassName) {
          if (cssMap.has(className)) {
            if (comment) {
              const val = cssMap.get(className)!
              val.commentTexts.push(comment)
              cssMap.set(className, val)
            }
          } else {
            const styleProps = stylesByClassName[className]

            // get object of style objects
            const { css } = getStylesClassName('.', styleProps as any)
            cssMap.set(className, { css, commentTexts: [comment] })
          }
        }
      },
      exit(traversePath: TraversePath<t.JSXElement>) {
        if (traversePath._complexComponentProp) {
          if (t.isJSXElement(traversePath.parentPath)) {
            // bump
            traversePath.parentPath._complexComponentProp = [].concat(
              traversePath.parentPath._complexComponentProp || [],
              traversePath._complexComponentProp,
            )
          } else {
            // find nearest Statement
            let statementPath = traversePath
            do {
              statementPath = statementPath.parentPath
            } while (!t.isStatement(statementPath))

            invariant(t.isStatement(statementPath), 'Could not find a statement')

            const decs = t.variableDeclaration('var', [].concat(traversePath._complexComponentProp))

            statementPath.insertBefore(decs)
          }
          traversePath._complexComponentProp = null
        }
      },
    },
  }

  traverse(ast, traverseOptions)

  const resultCSS = Array.from(cssMap.values())
    .map(n => n.commentTexts.map(txt => `${txt}\n`).join('') + n.css)
    .join('')
  // path.parse doesn't exist in the webpack'd bundle but path.dirname and path.basename do.
  const extName = path.extname(sourceFileName)
  const baseName = path.basename(sourceFileName, extName)
  const cssRelativeFileName = `./${baseName}__jsxstyle.css`
  const cssFileName = path.join(sourceDir, cssRelativeFileName)

  // append require/import statement to the document
  if (resultCSS !== '') {
    if (useImportSyntax) {
      ast.program.body.unshift(t.importDeclaration([], t.stringLiteral(cssRelativeFileName)))
    } else {
      ast.program.body.unshift(
        t.expressionStatement(
          t.callExpression(t.identifier('require'), [t.stringLiteral(cssRelativeFileName)]),
        ),
      )
    }
  }

  const result = generate(
    ast,
    {
      compact: 'auto',
      concise: false,
      filename: sourceFileName,
      quotes: 'single',
      retainLines: false,
      sourceFileName,
      sourceMaps: true,
    },
    src,
  )

  console.log('result', result.code)

  return {
    ast,
    css: resultCSS,
    cssFileName,
    js: result.code,
    map: result.map,
  }
}
