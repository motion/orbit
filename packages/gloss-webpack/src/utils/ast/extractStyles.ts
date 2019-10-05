import generate from '@babel/generator'
import traverse from '@babel/traverse'
import t = require('@babel/types')
import literalToAst from 'babel-literal-to-ast'
import { getAllStyles, getStylesClassName, GlossStaticStyleDescription, GlossView, validCSSAttr } from 'gloss'
import invariant = require('invariant')
import path = require('path')
import util = require('util')

import { CacheObject } from '../../types'
import { getStylesByClassName } from '../getStylesByClassName'
import { evaluateAstNode } from './evaluateAstNode'
import { extractStaticTernaries, Ternary } from './extractStaticTernaries'
import { getPropValueFromAttributes } from './getPropValueFromAttributes'
import { parse } from './parse'

export interface ExtractStylesOptions {
  views: {
    [key: string]: GlossView<any>
  }
  mediaQueryKeys?: string[]
  internalViewsPath?: string
  deoptKeys?: string[]
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
  className: true,
}

const JSXSTYLE_SOURCES = {
  '@o/ui': true,
  '@o/ui/test': true,
}

export function extractStyles(
  src: string | Buffer,
  sourceFileName: string,
  { cacheObject, warnCallback }: Options,
  options: ExtractStylesOptions,
): {
  js: string | Buffer
  css: string
  cssFileName: string | null
  ast: t.File
  map: any // RawSourceMap from 'source-map'
} {
  const JSX_VALID_NAMES = Object.keys(options.views).filter(x => {
    return options.views[x] && !!options.views[x].staticStyleConfig
  })

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

  const sourceDir = path.dirname(sourceFileName)

  // Using a map for (officially supported) guaranteed insertion order
  const cssMap = new Map<string, { css: string; commentTexts: string[] }>()

  const ast = parse(src)

  let jsxstyleSrc = false
  const validComponents = {}
  // default to using require syntax
  let useImportSyntax = false

  const shouldPrintDebug = src[0] === '/' && src[1] === '/' && src[2] === '!'

  const views: { [key: string]: GlossView<any> } = {}

  // we allow things within the ui kit to avoid the more tedious config
  const isInternal =
    options.internalViewsPath && sourceFileName.indexOf(options.internalViewsPath) === 0

  let importsGloss = false

  // Find jsxstyle require in program root
  ast.program.body = ast.program.body.filter((item: t.Node) => {
    if (t.isImportDeclaration(item)) {
      // not imported from jsxstyle? byeeee
      if (item.source.value === 'gloss') {
        importsGloss = true
      }
      if (!isInternal && !JSXSTYLE_SOURCES.hasOwnProperty(item.source.value)) {
        return true
      }
      jsxstyleSrc = true
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
        views[specifier.local.name] = options.views[specifier.local.name]
        validComponents[specifier.local.name] = true
        // dont remove the import
        return true
      })
    }
    return true
  })

  /**
   * Step 1: Compiled the gloss() style views and remember if they are able to be compiled
   * in step 2
   */
  const localViews: { [key: string]: GlossStaticStyleDescription } = {}
  if (importsGloss) {
    traverse(ast, {
      // only if its declared as a variable (const MyView = gloss())
      CallExpression: {
        enter(path) {
          if (t.isCallExpression(path.node) && t.isIdentifier(path.node.callee)) {
            // imported from gloss
            if (path.node.callee.name !== 'gloss') {
              return
            }
            // assigned to a variable
            if (t.isVariableDeclarator(path.parent) && t.isIdentifier(path.parent.id)) {
              const name = path.parent.id.name

              // mark as valid component to optimize later in JSX usage
              // TODO we need to distinguish between local and exported, local
              //   should only optimize in this file, exported should go across borders

              // now optimize and compile away
              if (path.node.arguments.length) {
                const extendsViewIdentifier =
                  t.isIdentifier(path.node.arguments[0]) && path.node.arguments[0].name

                let view: GlossView<any> | null = null

                if (extendsViewIdentifier) {
                  // extends one of our optimizable views
                  if (views[extendsViewIdentifier]) {
                    view = views[name]
                    views[name] = options.views[extendsViewIdentifier]
                    validComponents[name] = true
                  }
                }

                // parse style objects out and return them as array of [{ ['namespace']: 'className' }]
                let staticStyleConfig: GlossStaticStyleDescription | null = null

                path.node.arguments = path.node.arguments.map((arg, index) => {
                  if ((index === 0 || index === 1) && t.isObjectExpression(arg)) {
                    let styleObject = null
                    try {
                      styleObject = evaluateAstNode(arg)
                    } catch (err) {
                      console.log(
                        'note, couldnt parse this style object statically',
                        name,
                        'extends',
                        extendsViewIdentifier,
                      )
                      return arg
                    }
                    // uses the base styles if necessary, merges just like gloss does
                    const { styles, conditionalStyles } = getAllStyles(
                      view ? view.internal.getConfig() : undefined,
                      styleObject,
                    )
                    // then put them all into an array so gloss later can use that
                    const out: GlossStaticStyleDescription = {
                      className: '',
                    }
                    for (const key in styles) {
                      const info = getStylesClassName(key, styles[key])
                      cssMap.set(info.className, { css: info.css, commentTexts: [] })
                      out.className += ` ${info.className}`
                    }
                    if (conditionalStyles) {
                      out.conditionalClassNames = {}
                      for (const prop in conditionalStyles) {
                        out.conditionalClassNames[prop] = ''
                        for (const key in conditionalStyles[prop]) {
                          const val = conditionalStyles[prop][key]
                          const info = getStylesClassName(prop, val)
                          cssMap.set(info.className, { css: info.css, commentTexts: [] })
                          out.conditionalClassNames[prop] += ` ${info.className}`
                        }
                      }
                    }
                    staticStyleConfig = out
                    localViews[name] = out
                    return t.nullLiteral()
                  }
                  return arg
                })

                // add it to runtime: gloss(View, null, { ...staticStyleConfig })
                if (staticStyleConfig) {
                  path.node.arguments.push(literalToAst(staticStyleConfig))
                }
              }
            }
          }
        },
      },
    })
  }

  // jsxstyle isn't included anywhere, so let's bail
  if (!jsxstyleSrc || !Object.keys(validComponents).length) {
    return {
      ast,
      css: '',
      cssFileName: null,
      js: src,
      map: null,
    }
  }

  // per-file cache of evaluated bindings
  // const bindingCache = {}

  /**
   * Step 2: Statically extract from JSX < /> nodes
   */
  traverse(ast, {
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
        const view = views[originalNodeName]
        invariant(!!view, `Must have a view passed to config ${originalNodeName}`)
        const { staticStyleConfig } = view
        invariant(
          !!staticStyleConfig,
          `Must have a view with staticStyleConfig for ${originalNodeName}`,
        )

        // Get valid css props
        const cssAttributes = staticStyleConfig.cssAttributes || validCSSAttr

        // evaluateVars = false
        const attemptEval = evaluateAstNode
        // evaluateVars
        //   ? evaluateAstNode
        //   : (() => {
        //       // Generate scope object at this level
        //       const staticNamespace = getStaticBindingsForScope(
        //         traversePath.scope,
        //         sourceFileName,
        //         bindingCache,
        //       )

        //       const evalContext = vm.createContext(staticNamespace)

        //       // called when evaluateAstNode encounters a dynamic-looking prop
        //       const evalFn = (n: t.Node) => {
        //         // variable
        //         if (t.isIdentifier(n)) {
        //           invariant(
        //             staticNamespace.hasOwnProperty(n.name),
        //             'identifier not in staticNamespace',
        //           )
        //           return staticNamespace[n.name]
        //         }
        //         return vm.runInContext(`(${generate(n).code})`, evalContext)
        //       }

        //       return (n: t.Node) => evaluateAstNode(n, evalFn)
        //     })()

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

        // let propsAttributes: (t.JSXSpreadAttribute | t.JSXAttribute)[] = []
        const staticAttributes: Record<string, any> = {}
        let inlinePropCount = 0
        const staticTernaries: Ternary[] = []

        let shouldDeopt = false

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

          let name = attribute.name.name

          // for fully deoptimizing certain keys
          if (staticStyleConfig.deoptProps && staticStyleConfig.deoptProps.includes(name)) {
            shouldDeopt = true
            return true
          }
          if (shouldDeopt) {
            return true
          }

          // for avoiding processing certain keys
          if (staticStyleConfig.avoidProps && staticStyleConfig.avoidProps.includes(name)) {
            inlinePropCount++
            return true
          }

          let value: any =
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
          if (name === 'ref') {
            inlinePropCount++
            return true
          }
          if (!cssAttributes[name]) {
            inlinePropCount++
            return true
          }

          // allow them to have alternate names for things
          if (typeof cssAttributes[name] === 'object') {
            const definition = cssAttributes[name]
            name = definition.name
            value = definition.value[value]
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

        if (shouldDeopt) {
          return
        }

        let classNamePropValue: t.Expression | null = null

        const classNamePropIndex = node.attributes.findIndex(
          attr => !t.isJSXSpreadAttribute(attr) && attr.name && attr.name.name === 'className',
        )
        if (classNamePropIndex > -1 && Object.keys(staticAttributes).length > 0) {
          classNamePropValue = getPropValueFromAttributes('className', node.attributes)
          node.attributes.splice(classNamePropIndex, 1)
        }

        const stylesByClassName = getStylesByClassName(staticAttributes, cacheObject, view)

        // if all style props have been extracted, jsxstyle component can be
        // converted to a div or the specified component
        if (inlinePropCount === 0) {
          // TODO we can do this but we'd need a slightly different strategy:
          //  Config needs to know how to parse the components.... so we'd need like a way to
          //  take View and run it, get the classnames, and return the div here
          //  because View may add more styles on top
          // add static styles base
          if (view.internal) {
            // local views we already parsed the css out
            const localView = localViews[node.name.name]
            if (localView) {
              for (const className of localView.className.trim().split(' ')) {
                // empty object because we already parsed it out and added to map
                stylesByClassName[className] = {}
              }
            } else {
              // weird we have to compile twice, need to redo a bit
              const styles = {
                ...view.internal.staticStyles.styles['.'],
                // we may have set some default props
                ...view.defaultProps,
              }
              const info = getStylesClassName('.', styles)
              stylesByClassName[info.className] = styles
            }

            node.name.name = (view.defaultProps && view.defaultProps.tagName) || 'div'
          }
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

        if (traversePath.node.closingElement) {
          // this seems strange
          if (t.isJSXMemberExpression(traversePath.node.closingElement.name)) return
          traversePath.node.closingElement.name.name = node.name.name
        }

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

        if (staticTernaries.length > 0) {
          const ternaryObj = extractStaticTernaries(staticTernaries, cacheObject)
          // ternaryObj is null if all of the extracted ternaries have falsey consequents and alternates
          if (ternaryObj !== null) {
            // add extracted styles by className to existing object
            Object.assign(stylesByClassName, ternaryObj.stylesByClassName)
            classNameObjects.push(ternaryObj.ternaryExpression)
          }
        }

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
                t.jsxIdentifier('className'),
                t.stringLiteral(classNamePropValueForReals.value),
              ),
            )
          } else {
            node.attributes.push(
              t.jsxAttribute(
                t.jsxIdentifier('className'),
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
  })

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
      // @ts-ignore
      quotes: 'single',
      retainLines: false,
      sourceFileName,
      sourceMaps: true,
    },
    src,
  )

  if (shouldPrintDebug) {
    console.log('output >>', result.code)
  }

  return {
    ast,
    css: resultCSS,
    cssFileName,
    js: result.code,
    map: result.map,
  }
}
