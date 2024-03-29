import * as babel from '@babel/core'
import generate from '@babel/generator'
import traverse, { NodePath } from '@babel/traverse'
import * as t from '@babel/types'
import literalToAst from 'babel-literal-to-ast'
import { getGlossProps, GlossStaticStyleDescription, GlossView, isGlossView, StaticUtils, ThemeStyleInfo, tracker, validCSSAttr } from 'gloss'
import invariant from 'invariant'
import path from 'path'
import util from 'util'
import vm from 'vm'

import { CacheObject, ExtractStylesOptions } from '../types'
import { evaluateAstNode, EvaluateASTNodeOptions } from './evaluateAstNode'
import { extractStaticTernaries, Ternary } from './extractStaticTernaries'
import { getPropValueFromAttributes } from './getPropValueFromAttributes'
import { getStaticBindingsForScope } from './getStaticBindingsForScope'
import { htmlAttributes } from './htmlAttributes'
import { parse, parserOptions } from './parse'

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

// used for later seeing how much we can extract (and to apply theme styles)
// gives us information if the themes can be extracted via trackState
const viewInformation: { [key: string]: ThemeStyleInfo } = {}
let hasParsedViewInformation = false

export function extractStyles(
  src: string | Buffer,
  sourceFileName: string,
  { outPath, outRelPath }: any,
  { cacheObject }: Options,
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

  if (!hasParsedViewInformation) {
    hasParsedViewInformation = true
    for (const key in options.views) {
      const view = options.views[key]
      if (isGlossView(view)) {
        const defaultProps = view.internal.glossProps.defaultProps ?? {}
        viewInformation[key] = StaticUtils.getThemeStyles(view, options.defaultTheme, defaultProps)
      }
    }
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
  const isInternal = options.internalViewsPaths?.some(x => sourceFileName.indexOf(x) === 0) ?? false

  let importsGloss = false

  // Find gloss require in program root
  ast.program.body = ast.program.body.filter((item: t.Node) => {
    if (t.isImportDeclaration(item)) {
      // not imported from gloss? byeeee
      if (item.source.value === 'gloss') {
        importsGloss = true
      }
      if (!importsGloss && !isInternal && !GLOSS_SOURCES[item.source.value]) {
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
        if (shouldPrintDebug) {
          console.log('found valid component', specifier.local.name)
        }
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
  const localStaticViews: {
    [key: string]: {
      staticDesc: GlossStaticStyleDescription,
      propObject: any
      defaultProps?: Object
      parent?: GlossView
    }
  } = {}

  if (importsGloss || isInternal) {
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

        const localViewName = t.isIdentifier(glossCall.arguments[0]) && glossCall.arguments[0].name
        let view: GlossView<any> | null = null

        // parse style objects out and return them as array of [{ ['namespace']: 'className' }]
        let staticStyleDesc: GlossStaticStyleDescription | null = null

        // this stuff is used by step 2 (theme functions)
        // any props leftover after parsing gloss style props
        let restDefaultProps = {}

        const evaluate = createEvaluator(path, sourceFileName)

        glossCall.arguments = glossCall.arguments.map((arg, index) => {
          if ((index === 0 || index === 1) && t.isObjectExpression(arg)) {
            let propObject = {}
            let unevaluated: any[] = []
            try {
              const opts: EvaluateASTNodeOptions = {
                evaluateFunctions: false,
                unevaluated: []
              }
              propObject = evaluate(arg, opts)
              unevaluated = opts.unevaluated
              if (shouldPrintDebug) {
                console.log('propObject', propObject)
              }
            } catch (err) {
              console.log('Cant parse style object - this is ok, just de-opt', name, '>', localViewName)
              if (shouldPrintDebug) {
                console.log('err', err)
              }
              return arg
            }

            // if no error, set local view info
            if (localViewName) {
              // extends one of our optimizable views
              if (views[localViewName]) {
                views[name] = options.views[localViewName]
                view = views[name]
              }
            }

            // uses the base styles if necessary, merges just like gloss does
            const { styles, conditionalStyles, defaultProps, internalDefaultProps } = getGlossProps(
              propObject,
              view,
              view?.internal?.depth ?? 0
            )
            if (shouldPrintDebug) {
              console.log('glossCall.arguments parse gloss props', name, styles, conditionalStyles)
            }

            // then put them all into an array so gloss later can use that
            const out: GlossStaticStyleDescription = {
              className: '',
            }

            if (defaultProps.className) {
              out.className = defaultProps.className
              delete defaultProps.className
            }

            const depth = (view?.internal?.depth ?? -1) + 1

            for (const ns in styles) {
              const info = StaticUtils.getStyles(styles[ns], depth, ns)
              if (shouldPrintDebug) {
                console.log('got static extract', name, ns, info, styles[ns])
              }
              if (info) {
                cssMap.set(info.className, { css: info.css, commentTexts: [] })
                out.className += ` ${info.className}`
              } else {
                if (shouldPrintDebug) {
                  console.log('no info', ns, styles)
                }
              }
            }

            if (conditionalStyles) {
              out.conditionalClassNames = {}
              for (const prop in conditionalStyles) {
                out.conditionalClassNames[prop] = ''
                for (const ns in conditionalStyles[prop]) {
                  const val = conditionalStyles[prop][ns]
                  const info = StaticUtils.getStyles(val, depth, ns)
                  if (info) {
                    cssMap.set(info.className, { css: info.css, commentTexts: [] })
                    out.conditionalClassNames[prop] += ` ${info.className}`
                  }
                }
              }
            }

            localStaticViews[name] = {
              staticDesc: out,
              propObject,
              defaultProps,
              parent: view,
            }

            if (out.className || out.conditionalClassNames) {
              staticStyleDesc = out
            }

            // keep any non-style props on the glossProps
            let defaultPropsLeave = unevaluated

            if (internalDefaultProps && Object.keys(internalDefaultProps).length) {
              const objectLeaveProps = literalToAst(internalDefaultProps) as t.ObjectExpression
              defaultPropsLeave = [
                ...defaultPropsLeave,
                ...objectLeaveProps.properties
              ]
            }

            // if we have defaultProps or unevaluated non-extracted items, leave them
            if (defaultPropsLeave.length) {
              return t.objectExpression(defaultPropsLeave)
            }

            return t.nullLiteral()
          }
          return arg
        })

        // add it to runtime: gloss(View, null, { ...staticStyleDesc })
        if (staticStyleDesc) {
          if (glossCall.arguments.length === 1) {
            glossCall.arguments.push(t.nullLiteral())
          }
          glossCall.arguments.push(literalToAst(staticStyleDesc))
        }

        if (Object.keys(restDefaultProps).length) {
          const argIndex = t.isNullLiteral(glossCall.arguments[0]) ? 0 : 1
          console.log('restDefaultProps', restDefaultProps)
          glossCall.arguments[argIndex] = literalToAst(restDefaultProps)
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

  // creates an evaluator to get complex values from babel in this path
  function createEvaluator(path: NodePath<any>, sourceFileName: string, defaultOpts?: EvaluateASTNodeOptions) {
    // Generate scope object at this level
    const staticNamespace = getStaticBindingsForScope(
      path.scope,
      sourceFileName,
      // per-file cache of evaluated bindings
      // TODO can be per-module?
      {},
      options.whitelistStaticModules,
      execFile,
    )
    const evalContext = vm.createContext(staticNamespace)
    const evalFn = (n: t.Node) => {
      // called when evaluateAstNode encounters a dynamic-looking prop
      // variable
      if (t.isIdentifier(n)) {
        invariant(
          staticNamespace[n.name],
          'identifier not in staticNamespace',
        )
        return staticNamespace[n.name]
      }
      return vm.runInContext(`(${generate(n).code})`, evalContext)
    }
    return (n: t.Node, o?: EvaluateASTNodeOptions) => {
      return evaluateAstNode(n, evalFn, { ...defaultOpts, ...o })
    }
  }


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
          !validComponents[node.name.name]
        ) {
          return
        }

        // Remember the source component
        const originalNodeName = node.name.name
        const localView = localStaticViews[originalNodeName]
        let view = views[originalNodeName]
        // for parentView config
        let extraDepth = 0
        let domNode = 'div'

        let staticStyleConfig: GlossView<any>['staticStyleConfig'] | null = null
        if (view) {
          staticStyleConfig = view.staticStyleConfig
          // lets us have plain functional views like Stack
          if (staticStyleConfig.parentView) {
            view = staticStyleConfig.parentView
            extraDepth = 1
          }
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

        const attemptEval = evaluateAstNode //createEvaluator(traversePath as any, sourceFileName, { evaluateFunctions: false })

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

        const staticAttributes: Record<string, any> = {}
        const htmlExtractedAttributes = {}
        let inlinePropCount = 0
        const staticTernaries: Ternary[] = []
        const classNameObjects: (t.StringLiteral | t.Expression)[] = []

        let shouldDeopt = false

        const ogAttributes = node.attributes
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
            if (shouldPrintDebug) console.log('inline prop via non normal attr')
            inlinePropCount++
            return true
          }

          let name = attribute.name.name

          // for fully deoptimizing certain keys
          if (staticStyleConfig) {
            if (staticStyleConfig.deoptProps?.includes(name)) {
              shouldDeopt = true
              return true
            }
            // for avoiding processing certain keys
            if (staticStyleConfig.avoidProps?.includes(name)) {
              if (shouldPrintDebug) console.log('inline prop via avoidProps')
              inlinePropCount++
              return true
            }
          }

          let value: any = t.isJSXExpressionContainer(attribute?.value)
              ? attribute.value.expression
              : attribute.value

          // boolean prop / conditionals
          const allConditionalClassNames = {
            ...view?.internal?.compiledInfo?.conditionalClassNames ?? null,
            ...localView?.staticDesc?.conditionalClassNames ?? null,
          }
          if (allConditionalClassNames[name]) {
            // we can just extract to className
            if (value === null) {
              // extract but still put it onto staticAttributes for themeFn to use
              staticAttributes[name] = true
              return false
            }

            // if dynamic value we just use it on className
            classNameObjects.push(
              t.conditionalExpression(
                value,
                t.stringLiteral(allConditionalClassNames[name]),
                t.stringLiteral('')
              )
            )
            return false
          }

          // boolean props have null value
          if (!value) {
            inlinePropCount++
            return true
          }

          // if one or more spread operators are present and we haven't hit the last one yet, the prop stays inline
          if (lastSpreadIndex > -1 && idx <= lastSpreadIndex) {
            inlinePropCount++
            return true
          }
          // pass ref, key, and style props through untouched
          if (UNTOUCHED_PROPS[name]) {
            return true
          }

          if (name === 'ref') {
            inlinePropCount++
            return true
          }

          const trackState = viewInformation[originalNodeName]?.trackState
          if (trackState) {
            if (trackState?.nonCSSVariables?.has(name)) {
              if (shouldPrintDebug) console.log('inline prop via nonCSSVariables')
              inlinePropCount++
              return true
            }
          }

          if (!isCSSAttribute(name)) {
            // we can safely leave html attributes
            // TODO make this more customizable / per-tagname
            if (htmlAttributes[name]) {
              try {
                htmlExtractedAttributes[name] = attemptEval(value)
              } catch(err) {
                // oo fancy! this basically says if we can't eval this safely, and its used by the themeFn
                // then we need to deopt here. if it can be evaluated, we're good, we'll run theme here later
                if (trackState?.usedProps?.has(name)) {
                  if (shouldPrintDebug) {
                    console.log('we use this in this component', name)
                  }
                  inlinePropCount++
                  return true
                }
                // console.log('err getting html attr', name, err.message)
                // ok
              }
              return true
            }
            if (shouldPrintDebug) console.log('inline prop via !isCSSAttribute')
            inlinePropCount++
            return true
          }

          // allow statically defining a change from one prop to another (see Stack)
          if (typeof cssAttributes[name] === 'object') {
            if (t.isStringLiteral(value)) {
              const definition = cssAttributes[name]
              name = definition.name
              value = definition.value[value.value]
              staticAttributes[name] = value
              return false
            } else {
              console.log('couldnt parse a user defined cssAttribute', name, value)
              inlinePropCount++
              return true
            }
          }

          // if value can be evaluated, extract it and filter it out
          try {
            staticAttributes[name] = attemptEval(value)
            return false
          } catch {
            // ok
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
          if (shouldPrintDebug) console.log('inline prop via no match')
          inlinePropCount++
          return true
        })

        if (shouldPrintDebug) {
          console.log(`ok we parsed a JSX:
name: ${node.name.name}
inlinePropCount: ${inlinePropCount}
shouldDeopt: ${shouldDeopt}
domNode: ${domNode}
          `)
        }

        if (shouldDeopt) {
          node.attributes = ogAttributes
          return
        }

        let classNamePropValue: t.Expression | null = null

        const extractedStaticAttrs = Object.keys(staticAttributes).length > 0
        const classNamePropIndex = node.attributes.findIndex(
          attr => !t.isJSXSpreadAttribute(attr) && attr.name && attr.name.name === 'className',
        )
        if (classNamePropIndex > -1) {
          classNamePropValue = getPropValueFromAttributes('className', node.attributes)
          node.attributes.splice(classNamePropIndex, 1)
        }

        // used later to generate classname for item
        const stylesByClassName: { [key: string]: string } = {}

        const depth = (view?.internal?.depth ?? 1) + (localView?.parent?.internal?.depth ?? 1) + extraDepth
        const addStyles = (styleObj: any) => {
          const allStyles = StaticUtils.getAllStyles(styleObj, depth)
          for (const info of allStyles) {
            if (info.css) {
              if (shouldPrintDebug) {
                console.log('add static styles', info.className, info.css)
              }
              stylesByClassName[info.className] = info.css
            }
          }
        }

        // capture views where they set it afterwards
        // plus any defaults passed through gloss
        const viewDefaultProps = {
          ...view?.defaultProps,
          ...view?.internal?.glossProps?.defaultProps,
        }

        if (extractedStaticAttrs) {
          const staticStyleProps = {
            ...viewDefaultProps,
            ...localView?.propObject,
            ...htmlExtractedAttributes,
            ...staticAttributes,
          }
          if (shouldPrintDebug) {
            // ignoreAttrs is usually huge
            const { ignoreAttrs, ...rest } = staticStyleProps
            console.log('adding static style props', rest)
          }
          addStyles(staticStyleProps)
        }

        // if all style props have been extracted, gloss component can be
        // converted to a div or the specified component
        if (inlinePropCount === 0) {
          // add in any local static classes
          if (localView) {
            stylesByClassName[localView.staticDesc.className] = null
          }

          const themeFns = view?.internal?.getConfig()?.themeFns
          if (themeFns) {
            // TODO we need to determine if this theme should deopt using the same proxy/tracker as gloss
            try {
              const props = {
                ...viewDefaultProps,
                ...localView?.propObject,
                ...htmlExtractedAttributes,
                ...staticAttributes,
              }
              const extracted = StaticUtils.getThemeStyles(view, options.defaultTheme, props).themeStyles
              if (shouldPrintDebug) {
                delete props['ignoreAttrs'] // ignore this its huge in debug output
                console.log('extracting from theme', !!localView, props, extracted)
              }
              for (const x of extracted) {
                stylesByClassName[x.className] = x.css
              }
            } catch(err) {
              console.log('error running theme', sourceFileName, err.message)
              return
            }
          }

          // add any default html props to tag
          for (const key in viewDefaultProps) {
            const val = viewDefaultProps[key]
            if (key === 'className') {
              classNameObjects.push(t.stringLiteral(val))
              continue
            }
            if (htmlAttributes[key]) {
              // @ts-ignore
              if (!node.attributes.some(x => x?.name?.name === key)) {
                // add to start so if its spread onto later its overwritten
                node.attributes.unshift(
                  t.jsxAttribute(
                    t.jsxIdentifier(key),
                    t.jsxExpressionContainer(literalToAst(val))
                  )
                )
              }
            }
          }

          // add a data-is="Name" so we can debug it more easily
          node.attributes.push(
            t.jsxAttribute(
              t.jsxIdentifier('data-is'),
              t.stringLiteral(node.name.name)
            )
          )

          if (localView) {
            node.name.name = domNode
          }

          // if they set a staticStyleConfig.parentView (see Stack)
          if (!isGlossView(view)) {
            if (view?.staticStyleConfig.parentView) {
              view = view.staticStyleConfig.parentView
            } else {
              node.name.name = domNode
            }
          }

          // if gloss view we may be able to optimize
          if (isGlossView(view)) {
            // local views we already parsed the css out
            const localView = localStaticViews[node.name.name]
            if (localView) {
              //
            } else {
              const { staticClasses } = view.internal.glossProps
              // internal classes
              for (const className of staticClasses) {
                const item = tracker.get(className.slice(2))
                const css = `${item.selector} { ${item.style} }`
                stylesByClassName[className] = css
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

        if (shouldPrintDebug) {
          console.log('stylesByClassName pre ternaries', stylesByClassName)
        }

        const extractedStyleClassNames = Object.keys(stylesByClassName).join(' ')

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
          if (shouldPrintDebug) {
            console.log('staticTernaries', staticTernaries, '\nternaryObj', ternaryObj)
          }
          // ternaryObj is null if all of the extracted ternaries have falsey consequents and alternates
          if (ternaryObj !== null) {
            // add extracted styles by className to existing object
            Object.assign(stylesByClassName, ternaryObj.stylesByClassName)
            classNameObjects.push(ternaryObj.ternaryExpression)
          }
        }

        if (extractedStyleClassNames) {
          classNameObjects.push(t.stringLiteral(extractedStyleClassNames))
          if (shouldPrintDebug) {
            console.log('extractedStyleClassNames', extractedStyleClassNames)
          }
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

        if (shouldPrintDebug) {
          console.log('classNamePropValueForReals', classNamePropValueForReals)
        }

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
    const name = `${className}__gloss.css`
    const importPath = `${outRelPath}/${name}`
    const filename = path.join(outPath, name)
    // append require/import statement to the document
    if (content !== '') {
      css.push({ filename, content })
      if (useImportSyntax) {
        ast.program.body.unshift(t.importDeclaration([], t.stringLiteral(importPath)))
      } else {
        ast.program.body.unshift(
          t.expressionStatement(
            t.callExpression(t.identifier('require'), [t.stringLiteral(importPath)]),
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
    console.log('output >> ', result.code)
    console.log('css output >>', css)
  }

  return {
    ast,
    css,
    js: result.code,
    map: result.map,
  }
}

const execCache = {}
const execFile = (file: string) => {
  if (execCache[file]) {
    return execCache[file]
  }
  console.log('exec', file)
  const out = babel.transformFileSync(file, {
    cwd: path.join(__dirname, '..', '..'),
    configFile: false,
    babelrc: false,
    parserOpts: parserOptions,
    plugins: [
      '@babel/plugin-transform-modules-commonjs',
      // omg this fixed it...
      ['@babel/plugin-transform-typescript', { isTSX: true }],
      '@babel/plugin-transform-react-jsx',
    ]
  }).code
  const exported = {
    exports: {}
  }
  vm.runInContext(out, vm.createContext(exported))
  const res = exported.exports
  execCache[file] = res
  return res
}
