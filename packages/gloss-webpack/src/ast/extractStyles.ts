import generate from '@babel/generator'
import traverse from '@babel/traverse'
import * as t from '@babel/types'
import literalToAst from 'babel-literal-to-ast'
import { getAllStyles, getGlossProps, getStyles, GlossStaticStyleDescription, GlossView, isGlossView, validCSSAttr } from 'gloss'
import invariant from 'invariant'
import path from 'path'
import util from 'util'

import { CacheObject } from '../types'
import { evaluateAstNode } from './evaluateAstNode'
import { extractStaticTernaries, Ternary } from './extractStaticTernaries'
import { getPropValueFromAttributes } from './getPropValueFromAttributes'
import { htmlAttributes } from './htmlAttributes'
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

const GLOSS_SOURCES = {
  '@o/ui': true,
  '@o/ui/test': true,
}

type CSSExtracted = { filename: string, content: string }

export function extractStyles(
  src: string | Buffer,
  sourceFileName: string,
  { cacheObject, warnCallback }: Options,
  options: ExtractStylesOptions,
): {
  js: string | Buffer
  css: CSSExtracted[]
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

  const mediaQueryPrefixes = options.mediaQueryKeys.map(x => `${x}-`)
  const sourceDir = path.dirname(sourceFileName)

  // Using a map for (officially supported) guaranteed insertion order
  const cssMap = new Map<string, { css: string; commentTexts: string[] }>()

  const ast = parse(src)

  let glossSrc = false
  const validComponents = {}
  // default to using require syntax
  let useImportSyntax = false

  const shouldPrintDebug = src[0] === '/' && src[1] === '/' && src[2] === '!'

  const views: { [key: string]: GlossView<any> } = {}
  const JSX_VALID_NAMES = Object.keys(options.views).filter(x => {
    return options.views[x] && !!options.views[x].staticStyleConfig
  })

  // we allow things within the ui kit to avoid the more tedious config
  const isInternal =
    options.internalViewsPath && sourceFileName.indexOf(options.internalViewsPath) === 0

  let importsGloss = false

  // Find gloss require in program root
  ast.program.body = ast.program.body.filter((item: t.Node) => {
    if (t.isImportDeclaration(item)) {
      // not imported from gloss? byeeee
      if (item.source.value === 'gloss') {
        importsGloss = true
      }
      if (!importsGloss && !isInternal && !GLOSS_SOURCES.hasOwnProperty(item.source.value)) {
        return true
      }
      glossSrc = true
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
  const localStaticViews: { [key: string]: GlossStaticStyleDescription } = {}

  if (importsGloss) {
    traverse(ast, {
      VariableDeclaration(path) {
        const dec = path.node.declarations[0]
        if (!dec || !t.isVariableDeclarator(dec) || !t.isIdentifier(dec.id)) return
        const name = dec.id.name

        // traverse and find gloss call
        let glossCall: t.CallExpression
        let chain = dec.init
        while (
          t.isCallExpression(chain) &&
          t.isMemberExpression(chain.callee) &&
          t.isCallExpression(chain.callee.object)
        ) {
          chain = chain.callee.object
        }
        // verify we found it
        if (
          t.isCallExpression(chain) &&
          t.isIdentifier(chain.callee) &&
          chain.callee.name === 'gloss'
        ) {
          // simple gloss without .theme etc
          glossCall = chain
        }

        if (!glossCall || !glossCall.arguments.length) {
          return
        }

        validComponents[name] = true

        const extendsViewIdentifier = t.isIdentifier(glossCall.arguments[0]) && glossCall.arguments[0].name
        let view: GlossView<any> | null = null

        if (extendsViewIdentifier) {
          // extends one of our optimizable views
          if (views[extendsViewIdentifier]) {
            view = views[name]
            views[name] = options.views[extendsViewIdentifier]
          }
        }

        // parse style objects out and return them as array of [{ ['namespace']: 'className' }]
        let staticStyleConfig: GlossStaticStyleDescription | null = null

        glossCall.arguments = glossCall.arguments.map((arg, index) => {
          if ((index === 0 || index === 1) && t.isObjectExpression(arg)) {
            let styleObject = null
            try {
              styleObject = evaluateAstNode(arg)
            } catch (err) {
              console.log('Cant parse style object', name, '>', extendsViewIdentifier)
              console.log('err', err)
              return arg
            }
            // uses the base styles if necessary, merges just like gloss does
            const { styles, conditionalStyles, defaultProps } = getGlossProps(
              view?.internal,
              styleObject,
            )

            // then put them all into an array so gloss later can use that
            const out: GlossStaticStyleDescription = {
              className: '',
            }

            if (defaultProps.className) {
              out.className = defaultProps.className
            }

            for (const ns in styles) {
              const info = getStyles(styles[ns])
              if (info) {
                cssMap.set(info.className, { css: info.css, commentTexts: [] })
                out.className += ` ${info.className}`
              } else {
                console.log('no info for ns', ns)
              }
            }
            if (conditionalStyles) {
              out.conditionalClassNames = {}
              for (const prop in conditionalStyles) {
                out.conditionalClassNames[prop] = ''
                for (const key in conditionalStyles[prop]) {
                  const val = conditionalStyles[prop][key]
                  const info = getStyles(val)
                  cssMap.set(info.className, { css: info.css, commentTexts: [] })
                  out.conditionalClassNames[prop] += ` ${info.className}`
                }
              }
            }
            staticStyleConfig = out
            localStaticViews[name] = out
            return t.nullLiteral()
          }
          return arg
        })

        // add it to runtime: gloss(View, null, { ...staticStyleConfig })
        if (staticStyleConfig) {
          if (glossCall.arguments.length === 1) {
            glossCall.arguments.push(t.nullLiteral())
          }
          glossCall.arguments.push(literalToAst(staticStyleConfig))
        }
      },
    })
  }

  // gloss isn't included anywhere, so let's bail
  if (!glossSrc || !Object.keys(validComponents).length) {
    return {
      ast,
      css: [],
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
          // skip non-gloss components
          !validComponents.hasOwnProperty(node.name.name)
        ) {
          return
        }

        // Remember the source component
        const originalNodeName = node.name.name
        const view = views[originalNodeName]

        let domNode = 'div'

        let staticStyleConfig: GlossView<any>['staticStyleConfig'] | null = null
        if (view) {
          staticStyleConfig = view.staticStyleConfig
          domNode = view.staticStyleConfig?.tagName
            ?? view.internal?.glossProps.defaultProps.tagName
            ?? 'div'
        }

        // Get valid css props
        const cssAttributes = staticStyleConfig?.cssAttributes || validCSSAttr

        function isCSSAttribute(name: string) {
          if (cssAttributes[name]) return true
          if (mediaQueryPrefixes.some(x => name.indexOf(x) === 0)) return true
          return false
        }

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
          if (staticStyleConfig) {
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

          if (!isCSSAttribute(name)) {
            // we can safely leave html attributes
            // TODO make this more customizable / per-tagname
            if (htmlAttributes[name]) {
              return true
            }
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

        const stylesByClassName: { [key: string]: string } = {}

        const addStyles = (styleObj: any) => {
          const allStyles = getAllStyles(styleObj)
          for (const info of allStyles) {
            if (info.css) {
              stylesByClassName[info.className] = info.css
            }
          }
        }

        const themeFn = view?.internal?.getConfig()?.themeFn
        if (themeFn) {
          // TODO we need to determine if this theme should deopt using the same proxy/tracker as gloss
          try {
            const themeStyles = themeFn({
              ...view.defaultProps,
              ...staticAttributes,
            } as any)
            addStyles(themeStyles)
          } catch(err) {
            console.log('error running theme', sourceFileName, err.message)
          }
        } else {
          addStyles(staticAttributes)
          if (view?.defaultProps) {
            addStyles(view.defaultProps)
          }
        }


        // if all style props have been extracted, gloss component can be
        // converted to a div or the specified component

        if (inlinePropCount === 0) {
          // TODO we can do this but we'd need a slightly different strategy:
          //  Config needs to know how to parse the components.... so we'd need like a way to
          //  take View and run it, get the classnames, and return the div here
          //  because View may add more styles on top
          // add static styles base

          const localView = localStaticViews[node.name.name]
          if (localView) {
            for (const className of localView.className.trim().split(' ')) {
              // empty object because we already parsed it out and added to map
              stylesByClassName[className] = null
            }
            node.name.name = 'div'
          }

          // if gloss view we may be able to optimize
          if (isGlossView(view)) {
            // local views we already parsed the css out
            const localView = localStaticViews[node.name.name]
            if (localView) {
              for (const className of localView.className.trim().split(' ')) {
                // empty object because we already parsed it out and added to map
                stylesByClassName[className] = null
              }
            } else {
              const { staticClasses } = view.internal.getConfig()
              // internal classes
              for (const className of staticClasses) {
                // empty object because we already parsed it out and added to map
                stylesByClassName[className] = null
              }
            }

            node.name.name = domNode
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
            const css = stylesByClassName[className]
            if (css) {
              if (typeof css !== 'string') {
                throw new Error(`CSS is not a string, for ${className}: ${JSON.stringify(stylesByClassName, null, 2)}, ${typeof css}`)
              }
              cssMap.set(className, { css, commentTexts: [comment] })
            }
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

  const css: CSSExtracted[] = []

  // Write out CSS using it's className, this gives us de-duping for shared classnames
  for (const [className, entry] of cssMap.entries()) {
    const content = `${entry.commentTexts.map(txt => `${txt}\n`).join('')}${entry.css}`
    const relFileName = `./${className}__gloss.css`
    const filename = path.join(sourceDir, relFileName)
    // append require/import statement to the document
    if (content !== '') {
      css.push({ filename, content })
      if (useImportSyntax) {
        ast.program.body.unshift(t.importDeclaration([], t.stringLiteral(relFileName)))
      } else {
        ast.program.body.unshift(
          t.expressionStatement(
            t.callExpression(t.identifier('require'), [t.stringLiteral(relFileName)]),
          ),
        )
      }
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
    process.stdout.write('output >> ' + result.code)
  }

  return {
    ast,
    css,
    js: result.code,
    map: result.map,
  }
}
