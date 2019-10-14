import { CSSPropertySet, CSSPropertySetLoose, cssStringWithHash, stringHash, validCSSAttr } from '@o/css'
import { isEqual } from '@o/fast-compare'
import React from 'react'
import { createElement, isValidElement, memo, useEffect, useRef } from 'react'

import { Config } from './configureGloss'
import { validPropLoose, ValidProps } from './helpers/validProp'
import { GarbageCollector, StyleTracker } from './stylesheet/gc'
import { StyleSheet } from './stylesheet/sheet'
import { CompiledTheme } from './theme/createTheme'
import { pseudoProps } from './theme/pseudos'
import { themeVariableManager } from './theme/themeVariableManager'
import { useTheme } from './theme/useTheme'
import { GlossProps, GlossPropsPartial, GlossThemeProps } from './types'

// so you can reference in postProcessProps
export { StyleTracker } from './stylesheet/gc'

/**
 * Note: ThemeProps is optional, for the user to define that they are
 * filtering out props before they get to `theme`, which is helpful for keeping
 * their types simple. It's still relatively low level. See our @o/ui/View.tsx
 */
export interface GlossView<RawProps = {}, P = GlossProps<RawProps>> {
  (props: P, context?: any): React.ReactElement<any> | null
  shouldUpdateMap: WeakMap<object, boolean>
  propTypes?: React.ValidationMap<P>
  contextTypes?: React.ValidationMap<any>
  defaultProps?: Partial<P>
  displayName?: string
  // extra:
  ignoreAttrs?: { [key: string]: boolean }
  theme: (...themeFns: ThemeFn<RawProps>[]) => this
  withConfig: (config: GlossViewOpts<P>) => this
  internal: GlossInternals<P>
  staticStyleConfig?: {
    cssAttributes?: Object
    deoptProps?: string[]
    avoidProps?: string[]
    tagName?: string
  }
}

export type ThemeFn<RawProps = any> = (
  themeProps: GlossThemeProps<RawProps>,
  previous?: RawProps & CSSPropertySetLoose | null,
) => CSSPropertySetLoose | void | null

export type GlossViewOpts<Props = {}> = {
  displayName?: string
  ignoreAttrs?: { [key: string]: boolean }
  defaultProps?: Partial<Props>
  shouldAvoidProcessingStyles?: (props: Props) => boolean
  postProcessProps?: (curProps: Props, nextProps: any, getFinalStyles: () => CSSPropertySet) => any
  getElement?: (props: Props) => any
  isDOMElement?: boolean
}

type GlossInternals<Props = {}> = {
  parent: any
  targetElement: any
  themeFns: ThemeFn<Props>[] | null
  compiledInfo?: GlossStaticStyleDescription
  glossProps: {
    defaultProps: Partial<Props>
    styles: Object
    conditionalStyles: Object | undefined
  }
  getConfig: () => GlossInternalConfig
}

type GlossInternalConfig = {
  displayName: string
  config: GlossViewOpts | null
  staticClasses: string[]
  themeFn: ThemeFn | null
}

export type GlossStaticStyleDescription = {
  className: string
  conditionalClassNames?: {
    [key: string]: string
  }
}

const GLOSS_SIMPLE_COMPONENT_SYMBOL = '__GLOSS_SIMPLE_COMPONENT__'
export const tracker: StyleTracker = new Map()
export const sheet = new StyleSheet(true)
const gc = new GarbageCollector(sheet, tracker)
const whiteSpaceRegex = /[\s]+/g
const emptyObject = {}

let curTheme
// helpful global to let us add debugging in dev mode anywhere in here
let shouldDebug = false
const isDeveloping = process.env.NODE_ENV === 'development'

export function gloss<
  MyProps = {},
  ParentProps = {},
  Parent extends GlossView<ParentProps> = any,
  Props = GlossProps<MyProps & ParentProps>,
  PartialProps = GlossPropsPartial<MyProps & ParentProps>
>(
  a?: PartialProps | Parent | ((props: MyProps) => any) | string,
  b?: PartialProps,
  compiledInfo?: GlossStaticStyleDescription,
): GlossView<MyProps & ParentProps> {
  if (isDeveloping) {
    if (a === undefined && !!b) {
      throw new Error(
        `Passed in undefined as first argument to gloss(), you may have a circular import`,
      )
    }
  }

  let target: any = a || 'div'
  let glossPropsObject = b
  const hasGlossyParent = !!target[GLOSS_SIMPLE_COMPONENT_SYMBOL]
  let ignoreAttrs = emptyObject

  // shorthand: gloss({ ... })
  if (
    typeof a !== 'string' &&
    target.constructor &&
    target.constructor.name === 'Object' &&
    !b &&
    !hasGlossyParent &&
    !isValidElement(target) &&
    // if you pass an element wrapped in forwardRef() it needs to be filtered somehow..
    !target['$$typeof']
  ) {
    target = 'div'
    glossPropsObject = a as any
  }

  const targetElement = hasGlossyParent ? target.internal.targetElement : target
  const glossProps = getGlossProps(hasGlossyParent ? target.internal : null, glossPropsObject || null)
  const conditionalStyles = glossProps.conditionalStyles
  // static compilation information
  const { compiledClassName, conditionalClassNames } = getCompiledClassname(target, compiledInfo)

  // put the "rest" of non-styles onto defaultProps
  GlossView.defaultProps = glossProps.defaultProps

  let themeFn: ThemeFn | null = null
  let staticClasses: string[] | null = null
  let ogConfig: GlossViewOpts | null = null
  let config: GlossViewOpts | null = null
  let hasCompiled = false
  let getEl: GlossViewOpts['getElement'] | null = null
  let shouldUpdateMap: WeakMap<any, boolean>

  // we use staticClasses at compile time to we compile them right away
  // plus, its faster generally to do things at startup because doing
  // work on mount is usually during a render/has a frame budget
  function compile() {
    if (hasCompiled) return
    hasCompiled = true
    ignoreAttrs = ThemedView.ignoreAttrs ?? (hasGlossyParent && target.ignoreAttrs) ?? baseIgnoreAttrs
    shouldUpdateMap = GlossView['shouldUpdateMap']
    staticClasses = addStyles(glossProps.styles, ThemedView.displayName)
    themeFn = compileTheme(ThemedView)
    config = getCompiledConfig(ThemedView, ogConfig)
    getEl = config!.getElement
  }

  setTimeout(compile, 0)

  /**
   *
   *
   * 💅 The component for each gloss view.
   *
   *
   */
  function GlossView(props: GlossProps) {
    if (isDeveloping && props['debug']) {
      shouldDebug = true
    }

    // compile on first run to avoid extra work
    if (!hasCompiled) compile()

    const theme = useTheme(props)
    curTheme = theme
    const dynClasses = useRef<Set<string> | null>(null)

    // for smarter update tracking
    const last = useRef<{ props: Object; theme: CompiledTheme }>()
    let shouldAvoidStyleUpdate = false
    if (!last.current) {
      last.current = {
        props,
        theme,
      }
    } else {
      // ensure update on theme change
      if (last.current.theme !== theme) {
        last.current.theme = theme
      } else {
        // @ts-ignore
        shouldAvoidStyleUpdate = shouldUpdateMap.get(props) === false
      }
    }

    // unmount
    useEffect(() => {
      return () => {
        const x = dynClasses.current
        if (x && x.size > 0) {
          x.forEach(deregisterClassName)
        }
      }
    }, [])

    // if this is a plain view we can use tagName, otherwise just pass it down
    let element = typeof targetElement === 'string' ? props.tagName || targetElement : targetElement
    // helper for element
    if (getEl) {
      element = getEl(props)
    }

    // Optimization: only update if non-elements changed
    if (shouldAvoidStyleUpdate) {
      // because hooks can run in theme, be sure to run them
      // @ts-ignore
      theme && themeFn && themeFn(theme)
      return createElement(element, last.current.props, props.children)
    }

    // set up final props with filtering for various attributes
    let finalProps: any = {}

    let avoidStyles = false
    if (config?.shouldAvoidProcessingStyles) {
      avoidStyles = config.shouldAvoidProcessingStyles(props)
      if (avoidStyles) {
        // because hooks can run in theme, be sure to run them
        // @ts-ignore
        theme && themeFn && themeFn(theme)
      }
    }

    const dynStyles = addDynamicStyles(
      ThemedView.displayName,
      conditionalStyles,
      dynClasses.current,
      theme as any,
      themeFn,
      avoidStyles,
    )
    dynClasses.current = curDynClassNames

    const isDOMElement = typeof element === 'string' || (config ? config.isDOMElement : false)

    let className = ''

    for (const key in props) {
      if (props[key] === true && conditionalClassNames[key]) {
        className += ` ${conditionalClassNames[key]} `
        continue
      }
      if (isDOMElement) {
        if (ignoreAttrs[key]) continue
        if (conditionalStyles && conditionalStyles[key]) continue
        // TODO: need to figure out this use case: when a valid prop attr, but invalid val
        if (key === 'size' && typeof props[key] !== 'string') continue
        if (key === 'nodeRef') {
          finalProps.ref = props.nodeRef
          continue
        }
        if (ValidProps[key] || validPropLoose(key)) {
          finalProps[key] = props[key]
        }
      } else {
        if (conditionalStyles && conditionalStyles[key]) continue
        finalProps[key] = props[key]
      }
    }

    if (staticClasses || curDynClassNames.size) {
      className += staticClasses
        ? [...staticClasses, ...curDynClassNames].join(' ')
        : [...curDynClassNames].join(' ')
    }
    if (compiledClassName) {
      className += compiledClassName
    }
    finalProps.className = className

    if (isDeveloping) {
      finalProps['data-is'] = finalProps['data-is'] || ThemedView.displayName
    }

    // hook: setting your own props
    const postProcessProps = config && config.postProcessProps
    if (postProcessProps) {
      // TODO could hoist this cb fn
      postProcessProps(props, finalProps, () => {
        return {
          ...glossProps.styles['.'],
          ...dynStyles['.'],
        }
      })
    }

    if (isDeveloping && props['debug']) {
      shouldDebug = false
      const styles = finalProps.className
        .split(' ')
        .map(x => tracker.get(x.replace(/^s/, '')))
        .filter(Boolean)
      console.log('styles\n', styles, '\nprops\n', props, '\noutProps\n', finalProps)
    }

    last.current.props = finalProps
    return createElement(element, finalProps, props.children)
  }

  /**
   * Finish creating gloss view
   */
  const parent = hasGlossyParent ? target : null
  const internal: GlossInternals<Props> = {
    compiledInfo,
    glossProps,
    themeFns: null,
    parent,
    targetElement,
    getConfig: () => ({
      config: ogConfig,
      displayName: ThemedView.displayName || '',
      staticClasses: staticClasses || [],
      themeFn,
    }),
  }

  let ThemedView = createGlossView(GlossView, internal)

  // inherit default props
  if (hasGlossyParent) {
    ThemedView.defaultProps = target.defaultProps
  }

  ThemedView.withConfig = opts => {
    ogConfig = ogConfig || {}
    Object.assign(ogConfig, opts)

    // re-create it so it picks up displayName
    if (opts.displayName) {
      // this one is picked up by Profiling
      GlossView['displayName'] = opts.displayName
      ThemedView = createGlossView(GlossView, internal)
      // this one is picked up for use in classNames
      ThemedView['displayName'] = opts.displayName
    }

    if (opts.ignoreAttrs) {
      // TODO could have option to override or merge
      ignoreAttrs = {
        ...baseIgnoreAttrs,
        ...opts.ignoreAttrs,
      }
    }

    if (opts.defaultProps) {
      ThemedView.defaultProps = opts.defaultProps
    }

    return ThemedView
  }

  // add the default prop config
  ThemedView.staticStyleConfig = {
    cssAttributes: validCSSAttr,
    ...(parent ? parent.staticStyleConfig : null),
  }

  // TODO this any type is a regression from adding ThemeProps
  return ThemedView as any
}

function createGlossView(GlossView, config) {
  const { isEqual, shouldUpdateMap } = createGlossIsEqual()
  // @ts-ignore
  GlossView.shouldUpdateMap = shouldUpdateMap
  // @ts-ignore
  const res = memo(GlossView, isEqual) as any
  res.internal = config
  res[GLOSS_SIMPLE_COMPONENT_SYMBOL] = true
  res.theme = (...themeFns) => {
    config.themeFns = themeFns
    return res
  }
  return res
}

// keeps priority of hover/active/focus as expected
let mediaQueriesImportance = {}
let hasSetupMediaQueryKeys = false
const styleKeyScore = (x: string) => {
  let psuedoScore = 0
  if (x[0] === '&') {
    const hasFocus = x === '&:focus' ? 1 : 0
    const hasHover = x === '&:hover' ? 2 : 0
    const hasActive = x === '&:active' ? 3 : 0
    const hasDisabled = x === '&:disabled' ? 4 : 0
    psuedoScore += hasActive + hasHover + hasFocus + hasDisabled
  }
  if (psuedoScore) {
    return psuedoScore
  }
  // media query sort by the order they gave us in object
  if (Config.mediaQueries) {
    if (!hasSetupMediaQueryKeys) {
      hasSetupMediaQueryKeys = true
      for (const [index, key] of Object.keys(Config.mediaQueries).entries()) {
        // most important to least important
        mediaQueriesImportance[Config.mediaQueries[key]] = 10000 - index
      }
    }
    if (x in mediaQueriesImportance) {
      return mediaQueriesImportance[x]
    }
  }
  return 0
}

const styleKeysSort = (a: string, b: string) => (styleKeyScore(a) > styleKeyScore(b) ? 1 : -1)

// takes a style object, adds it to stylesheet, returns classnames
function addStyles(
  styles: any,
  displayName?: string,
  prevClassNames?: Set<string> | null,
  moreSpecific?: boolean,
) {
  const keys = Object.keys(styles)
  if (keys.length > 1) {
    keys.sort(styleKeysSort)
  }
  if (isDeveloping && shouldDebug) {
    console.log('addStyles sorted', keys, styles)
  }
  let classNames: string[] | null = null
  for (const key of keys) {
    const style = styles[key]
    // they may return falsy, conditional '&:hover': active ? hoverStyle : null
    if (!style) continue

    // add the stylesheets and classNames
    // TODO could do a simple "diff" so that fast-changing styles only change the "changing" props
    // it would likely help things like when you animate based on mousemove, may be slower in default case
    const className = addRules(displayName, style, key, moreSpecific || false, true)

    if (className) {
      classNames = classNames || []
      classNames.push(className)
      // if this is the first mount render or we didn't previously have this class then add it as new
      if (!prevClassNames || !prevClassNames.has(className)) {
        gc.registerClassUse(className[0] === 's' ? className.slice(1) : className)
      }
    }
  }
  return classNames
}

function mergePropStyles(styles: Object, propStyles: Object, props: Object) {
  for (const key in propStyles) {
    if (props[key] !== true) continue
    for (const ns in propStyles[key]) {
      styles[ns] = styles[ns] || {}
      mergeStyles(ns, styles, propStyles[key][ns], true)
    }
  }
}

const SPECIFIC = 's'

function deregisterClassName(name: string) {
  const nonSpecificClassName = name[0] === SPECIFIC ? name.slice(1) : name
  gc.deregisterClassUse(nonSpecificClassName)
}

let curDynClassNames = new Set<string>()
function addDynamicStyles(
  displayName: string = 'g',
  conditionalStyles: Object | undefined,
  prevClassNames: Set<string> | null,
  theme: GlossThemeProps,
  themeFn?: ThemeFn | null,
  avoidStyles?: boolean,
) {
  const dynStyles = {}
  curDynClassNames = new Set<string>()

  // applies styles most important to least important
  // that saves us some processing time (no need to set multiple times)
  // note that means the topmost `mergeStyles` will apply as most important

  // if passed any classes from a parent gloss view, merge them, ignore classname and track
  if (theme.className) {
    const propClassNames = theme.className.split(whiteSpaceRegex)
    // note this reverse: this is a bit odd
    // right now we have conditionalStyles applied as their own className (so base: .1, conditional: .2)
    // then we pass className="1 2" if we have a parent that the conditional style === true
    // what we probably want is to merge them all into their own single className
    // until then, we need to preserve the important order, so we reverse to make sure conditional applies first
    const len = propClassNames.length
    for (let i = len - 1; i >= 0; i--) {
      const className = propClassNames[i]
      const cn = className[0] === SPECIFIC ? className.slice(1) : className
      const info = tracker.get(cn)
      if (info) {
        // curId is looking if info.namespace was &:hover (sub-select) or "." (base) and then applying
        // otherwise it would apply hover styles to the base styles here
        const ns = info.namespace
        dynStyles[ns] = dynStyles[ns] || {}
        mergeStyles(ns, dynStyles, info.rules)
      } else if (className) {
        curDynClassNames.add(className)
      }
    }
  }

  if (!avoidStyles) {
    if (conditionalStyles) {
      mergePropStyles(dynStyles, conditionalStyles, theme)
    }

    if (theme && themeFn) {
      dynStyles['.'] = dynStyles['.'] || {}
      // set our config
      const themeStyles = themeFn(theme)
      const themePropStyles = mergeStyles('.', dynStyles, themeStyles, true)
      if (themePropStyles) {
        mergePropStyles(dynStyles, themePropStyles, theme)
      }
    }

    // add dyn styles
    const dynClassNames = addStyles(dynStyles, displayName, prevClassNames, true)
    if (dynClassNames) {
      for (const cn of dynClassNames) {
        curDynClassNames.add(cn)
      }
    }
  }

  // check what classNames have been removed if this is a secondary render
  if (prevClassNames) {
    for (const className of prevClassNames) {
      // if this previous class isn't in the current classes then deregister it
      if (!curDynClassNames.has(className)) {
        deregisterClassName(className)
      }
    }
  }

  return dynStyles
}

const isSubStyle = (x: string) => x[0] === '&' || x[0] === '@'

//
// this... THIS...
//  ... this is a tricky function
//  because its used on initial mount AND during renders
//  which is actually useful, yes, because you want the logic the same
//  BUT its also used nested! See themeFn => mergePropStyles
//  likely can be refactored, but just need to study it a bit before you do
//
function mergeStyles(
  id: string,
  baseStyles: Object,
  nextStyles?: CSSPropertySet | null | void,
  overwrite?: boolean,
  rest?: Object
): Object | undefined {
  if (!nextStyles) return
  // this is just for the conditional prop styles
  let propStyles
  for (const key in nextStyles) {
    // dont overwrite as we go down
    if (overwrite !== true && baseStyles[id][key] !== undefined) {
      continue
    }
    if (key === 'conditional') {
      // propStyles
      //   definition: gloss({ isTall: { height: '100%' } })
      //   usage: <Component isTall />
      for (const pKey in nextStyles[key]) {
        let subStyles = nextStyles[key][pKey]
        propStyles = propStyles || {}
        propStyles[pKey] = {}
        // they can nest (media queries/psuedo), split it out, eg:
        for (const sKey in subStyles) {
          // key = isTall
          // sKey = &:before
          if (isSubStyle(sKey)) {
            // keep all sub-styles on their key
            propStyles[pKey] = propStyles[pKey] || {}
            propStyles[pKey][sKey] = subStyles[sKey]
          } else {
            // we put base styles here, see 'base' check above
            propStyles[pKey]['.'] = propStyles[pKey]['.'] || {}
            propStyles[pKey]['.'][sKey] = subStyles[sKey]
          }
        }
      }
      continue
    }
    if (validCSSAttr[key]) {
      // valid regular attr
      baseStyles[id][key] = nextStyles[key]
    } else if (isSubStyle(key)) {
      for (const sKey in nextStyles[key]) {
        if (overwrite === true || !baseStyles[key] || baseStyles[key][sKey] === undefined) {
          baseStyles[key] = baseStyles[key] || {}
          baseStyles[key][sKey] = nextStyles[key][sKey]
        }
      }
    } else {
      const pseudoKey = pseudoProps[key]
      if (pseudoKey) {
        // merge in case they defined it two different ways
        baseStyles[pseudoKey] = baseStyles[pseudoKey] || {}
        Object.assign(baseStyles[pseudoKey], nextStyles[key])
        continue
      }

      if (Config.mediaQueries) {
        // media queries after subStyle, subStyle could have a - in it
        const index = key.indexOf('-')
        if (index > 0) {
          const mediaName = key.slice(0, index)
          const mediaSelector = Config.mediaQueries[mediaName]
          if (mediaSelector) {
            const styleKey = key.slice(index + 1)
            baseStyles[mediaSelector] = baseStyles[mediaSelector] || {}
            baseStyles[mediaSelector][styleKey] = nextStyles[key]
            continue
          }
        }
      }

      // not style, assign to rest
      if (rest) {
        rest[key] = nextStyles[key]
      }
    }
  }

  return propStyles
}

// happens once at initial gloss() call, so not as perf intense
// get all parent styles and merge them into a big object
export function getGlossProps(parent: GlossInternals | null, rawStyles: CSSPropertySet | null) {
  const styles = {
    '.': {},
  }
  // all the "rest" go onto default props
  let defaultProps = {}
  let conditionalStyles = mergeStyles('.', styles, rawStyles, false, defaultProps)

  // merge parent config
  if (parent) {
    if (parent.glossProps.defaultProps) {
      defaultProps = {
        ...parent.glossProps.defaultProps,
        ...defaultProps,
      }
    }
    const parentPropStyles = parent.glossProps.conditionalStyles
    if (parentPropStyles) {
      for (const key in parentPropStyles) {
        conditionalStyles = conditionalStyles || {}
        conditionalStyles[key] = conditionalStyles[key] || {}
        conditionalStyles[key] = {
          ...parentPropStyles[key],
          ...conditionalStyles[key],
        }
      }
    }
    const parentStyles = parent.glossProps.styles
    for (const key in parentStyles) {
      styles[key] = {
        ...parentStyles[key],
        ...styles[key],
      }
    }
  }

  return {
    styles,
    conditionalStyles,
    defaultProps,
  }
}

/**
 * We need to compile a few things to get the config right:
 *   1. get all the parents postProcessProps until:
 *   2. encounter a parent with getElement (and use that isDOMElement)
 *   3. stop there, don't keep going higher
 */
function getCompiledConfig(
  viewOG: GlossView,
  config: GlossViewOpts | null,
): GlossViewOpts {
  const compiledConf: GlossViewOpts = { ...config }
  let cur = viewOG
  while (cur) {
    const curConf = cur.internal.getConfig().config
    if (curConf) {
      if (curConf.postProcessProps) {
        // merge the postProcessProps
        const og = compiledConf.postProcessProps
        if (curConf.postProcessProps !== og) {
          compiledConf.postProcessProps = og
            ? (a, b, c) => {
                og(a, b, c)
                curConf.postProcessProps!(a, b, c)
              }
            : curConf.postProcessProps
        }
      }
      // find the first getElement and break here
      if (curConf.getElement) {
        compiledConf.getElement = curConf.getElement
        compiledConf.isDOMElement = curConf.isDOMElement
        break
      }
    }
    cur = cur.internal.parent
  }
  return compiledConf
}

// compile theme from parents
function compileTheme(viewOG: GlossView) {
  let cur = viewOG
  let all: ThemeFn[][] = []

  // get themes in order from most important (current) to least important (grandparent)
  while (cur) {
    const conf = cur.internal
    if (conf.themeFns) {
      all.push(conf.themeFns)
    }
    cur = conf.parent
  }

  // reverse, then flatten, so its a flat list of themes from least to most important
  // makes it easier to apply them in order
  all.reverse()
  const themes = all.flat().filter(Boolean)

  if (!themes.length) {
    return null
  }

  return (themeProps: Object) => {
    let styles: CSSPropertySetLoose | null = null
    for (const themeFn of themes) {
      const next = themeFn(themeProps as any, styles)
      if (next) {
        styles = styles || {}
        Object.assign(styles, next)
      }
    }
    return styles
  }
}

// adds rules to stylesheet and returns classname
export type BaseRules = {
  [key: string]: string | number
}
const cssOpts = {
  resolveFunctionValue: val => val(curTheme)
}

const nicePostfix = {
  '&:hover': 'hover',
  '&:active': 'active',
  '&:disabled': 'disabled',
  '&:focus': 'focus',
  '&:focus-within': 'focuswithin',
}

function addRules<A extends boolean>(
  displayName = '_',
  rules: BaseRules,
  namespace: string,
  moreSpecific: boolean,
  insert: A,
  parentSelector?: string
): (A extends true ? string : {
  css: string,
  className: string
}) | null {
  const [hash, style] = cssStringWithHash(rules, cssOpts)
  if (!hash) return null

  let className = `g${hash}`
  // build the class name with the display name of the styled component and a unique id based on the css and namespace
  // ensure we are unique for unique namespaces
  if (namespace !== '.') {
    const postfix = nicePostfix[namespace] || stringHash(namespace)
    className += `-${postfix}`
  }

  const isMediaQuery = namespace[0] === '@'
  const selector = getSelector(className, namespace, parentSelector)
  const css = isMediaQuery ? `${namespace} {${selector} {${style}}}` : `${selector} {${style}}`
  const finalClassName = moreSpecific ? `${SPECIFIC}${className}` : className
  // build up the correct selector, explode on commas to allow multiple selectors

  if (insert === true) {
    // this is the first time we've found this className
    if (!tracker.has(className)) {
      // insert the new style text
      tracker.set(className, {
        displayName,
        namespace,
        rules,
        selector,
        style,
        className,
      })
      sheet.insert(isMediaQuery ? namespace : selector, css)
    }
    // @ts-ignore
    return finalClassName
  }

  // @ts-ignore
  return { css, className: finalClassName }
}

// has to return a .s-id and .id selector for use in parents passing down styles
function getSelector(className: string, namespace: string, parentSelector = 'html body') {
  if (namespace[0] === '@') {
    // double specificity hack
    return `.${className}.${className}, ${parentSelector} .${SPECIFIC}${className}.${SPECIFIC}${className}`
  }
  if (namespace[0] === '&' || namespace.indexOf('&') !== -1) {
    // namespace === '&:hover, &:focus, & > div'
    const namespacedSelectors = namespace
      .split(',')
      .flatMap(part => {
        const selector = part.replace('&', className).trim()
        return [`${parentSelector} .${SPECIFIC}${selector}`, `.${selector}`]
      })
      .join(',')
    return namespacedSelectors
  }
  return `${parentSelector} .${SPECIFIC}${className}, .${className}`
}

// some internals we can export
if (isDeveloping && typeof window !== 'undefined') {
  window['gloss'] = window['gloss'] || {
    tracker,
    gc,
    sheet,
    validCSSAttr,
    themeVariableManager,
  }
}

export const isGlossView = (view: any): boolean => {
  return view && !!view[GLOSS_SIMPLE_COMPONENT_SYMBOL]
}

export const baseIgnoreAttrs = {
  ...validCSSAttr,
  width: false,
  height: false,
  size: false,
  src: false,
}

/**
 * Gloss componentShouldUpdate optimization - Gloss styles should never
 * rely on react elements (TODO document that, but weve never used it internally even on accident),
 * which means we can do nice optimization by tracking if only non-elements changed.
 */
function createGlossIsEqual() {
  const shouldUpdateMap = new WeakMap<object, boolean>()
  return {
    shouldUpdateMap,
    isEqual(a: any, b: any) {
      let shouldUpdate = false
      let shouldUpdateInner = false
      for (const key in b) {
        const bVal = b[key]
        if (isValidElement(bVal)) {
          shouldUpdate = true
          continue
        }
        if (!isEqual(a[key], bVal)) {
          shouldUpdate = true
          shouldUpdateInner = true
          break
        }
      }
      // ensure we didnt remove/add keys
      if (!shouldUpdate || !shouldUpdateInner) {
        for (const key in a) {
          if (!(key in b)) {
            shouldUpdate = true
            shouldUpdateInner = true
            break
          }
        }
      }
      shouldUpdateMap.set(b, shouldUpdateInner)
      return !shouldUpdate
    },
  }
}

function getCompiledClassname(parent: GlossView | any, compiledInfo?: GlossStaticStyleDescription) {
  let compiledClassName = compiledInfo && compiledInfo.className ? ` ${compiledInfo.className}` : ''
  // conditional classNames
  let conditionalClassNames = emptyObject
  if (compiledInfo?.conditionalClassNames) {
    conditionalClassNames = compiledInfo.conditionalClassNames
  }
  // compiled classNames inheritance
  if (parent?.internal) {
    const parentCompiledInfo = parent.internal.compiledInfo
    if (parentCompiledInfo) {
      // merge in parents conditionals (lesser priority)
      if (parentCompiledInfo.conditionalClassNames) {
        conditionalClassNames = {
          ...parent.internal.conditionalClassNames,
          ...conditionalClassNames,
        }
      }
      if (parentCompiledInfo.className) {
        compiledClassName += ` ${parentCompiledInfo.className}`
      }
    }
  }
  return { compiledClassName, conditionalClassNames }
}

/**
 * For use externally only (static style extract)
 */
export function getAllStyles(props: any) {
  if (!props) {
    return []
  }
  const allStyles = { '.': {} }
  mergeStyles('.', allStyles, props)
  const allClassNames: { css: string, className: string }[] = []
  for (const ns in allStyles) {
    const styleObj = allStyles[ns]
    const info = addRules('', styleObj, ns, true, false, 'body')
    if (info) {
      allClassNames.push(info)
    } else {
      console.warn(`No styles for ${ns}, props ${JSON.stringify(props)}, info ${JSON.stringify(info)}`)
    }
  }
  return allClassNames
}

/**
 * For use externally only (static style extract)
 */
export function getStyles(props: any) {
  return getAllStyles(props)?.[0] ?? null
}
