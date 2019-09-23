import { CSSPropertySet, CSSPropertySetLoose, cssString, styleToClassName, ThemeObject, validCSSAttr } from '@o/css'
import { isEqual } from '@o/fast-compare'
import { createElement, isValidElement, memo, useEffect, useRef } from 'react'

import { Config } from './configureGloss'
import { useTheme } from './helpers/useTheme'
import { validPropLoose, ValidProps } from './helpers/validProp'
import { GarbageCollector, StyleTracker } from './stylesheet/gc'
import { StyleSheet } from './stylesheet/sheet'
import { ThemeSelect } from './theme/Theme'

// so you can reference in postProcessProps
export { StyleTracker } from './stylesheet/gc'

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

export type BaseRules = {
  [key: string]: string | number
}

export type GlossProps<Props> = Props & {
  className?: string
  tagName?: string
  children?: React.ReactNode
  nodeRef?: any
  style?: any
  coat?: string | false
  themeSubSelect?: ThemeSelect
}

export type ThemeFn<Props = any> = (
  props: GlossProps<Props>,
  theme: ThemeObject,
  previous?: CSSPropertySetLoose | null,
) => CSSPropertySetLoose | undefined | null

export type GlossViewOpts<Props> = {
  displayName?: string
  ignoreAttrs?: { [key: string]: boolean }
  defaultProps?: Partial<Props>
  postProcessProps?: (curProps: Props, nextProps: any, tracker: StyleTracker) => any
  getElement?: (props: Props) => any
  isDOMElement?: boolean
}

type GlossInternalConfig = {
  id: string
  displayName: string
  targetElement: any
  styles: any
  conditionalStyles: Object
  config: GlossViewOpts<any> | null
}

type GlossInternals<Props> = {
  parent: any
  themeFns: ThemeFn<Props>[] | null
  getConfig: () => GlossInternalConfig
}

/**
 * Note: ThemeProps is optional, for the user to define that they are
 * filtering out props before they get to `theme`, which is helpful for keeping
 * their types simple. It's still relatively low level. See our @o/ui/View.tsx
 */
export interface GlossView<RawProps, ThemeProps = RawProps, Props = GlossProps<RawProps>> {
  // copied from FunctionComponent
  (props: Props, context?: any): React.ReactElement<any> | null
  shouldUpdateMap: WeakMap<any, boolean>
  propTypes?: React.ValidationMap<Props>
  contextTypes?: React.ValidationMap<any>
  defaultProps?: Partial<Props>
  displayName?: string
  // extra:
  ignoreAttrs?: { [key: string]: boolean }
  theme: (...themeFns: ThemeFn<ThemeProps>[]) => GlossView<RawProps>
  withConfig: (config: GlossViewOpts<Props>) => GlossView<RawProps>
  internal: GlossInternals<Props>
  staticStyleConfig?: {
    cssAttributes: Object
  }
}

const GLOSS_SIMPLE_COMPONENT_SYMBOL = '__GLOSS_SIMPLE_COMPONENT__'
export const tracker: StyleTracker = new Map()
export const sheet = new StyleSheet(false)
const gc = new GarbageCollector(sheet, tracker)
const whiteSpaceRegex = /[\s]+/g

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
        }
      }
      // ensure we didnt remove/add keys
      if (!shouldUpdate) {
        for (const key in a) {
          if (!(key in b)) {
            shouldUpdate = true
            shouldUpdateInner = true
          }
        }
      }
      shouldUpdateMap.set(b, shouldUpdateInner)
      return !shouldUpdate
    },
  }
}

let idCounter = 1
const viewId = () => idCounter++ % Number.MAX_SAFE_INTEGER

export function gloss<Props = any, ThemeProps = Props>(
  a?: CSSPropertySet | GlossView<Props, ThemeProps> | ((props: Props) => any) | string,
  b?: CSSPropertySet,
): GlossView<GlossProps<Props>, ThemeProps> {
  if (process.env.NODE_ENV === 'development') {
    if (a === undefined && !!b) {
      throw new Error(
        `Passed in undefined as first argument to gloss(), you may have a circular import`,
      )
    }
  }

  let target: any = a || 'div'
  let rawStyles = b
  const hasGlossyParent = !!target[GLOSS_SIMPLE_COMPONENT_SYMBOL]
  let ignoreAttrs: Object = (hasGlossyParent && target.ignoreAttrs) || baseIgnoreAttrs
  const targetConfig: GlossInternalConfig | null = hasGlossyParent
    ? target.internal.getConfig()
    : null

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
    rawStyles = a
  }

  const targetElement = !!targetConfig ? targetConfig.targetElement : target
  const id = `${viewId()}`
  const Styles = getAllStyles(id, targetConfig, rawStyles || null)
  const conditionalStyles = Styles.conditionalStyles

  let themeFn: ThemeFn | null = null
  let staticClasses: string[] | null = null

  // this elements helpers
  let ogConfig: GlossViewOpts<Props> | null = null
  let config: GlossViewOpts<Props> | null = null

  let hasCompiled = false
  let getEl: GlossViewOpts<Props>['getElement'] | null = null
  let shouldUpdateMap: WeakMap<any, boolean>

  /**
   *
   *
   * 💅 The component for each gloss view.
   *
   *
   */
  function GlossView(props: GlossProps<Props>) {
    // compile on first run to avoid extra work
    if (!hasCompiled) {
      hasCompiled = true
      themeFn = compileTheme(ThemedView)
      staticClasses = addStyles(Styles.styles, ThemedView.displayName)
      config = getCompiledConfig(ThemedView, ogConfig)
      getEl = config.getElement
      shouldUpdateMap = GlossView['shouldUpdateMap']
    }

    const theme = useTheme()
    const dynClasses = useRef<Set<string> | null>(null)

    // for smarter update tracking
    const last = useRef<{ props: Object; theme: ThemeObject }>()
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
      theme && themeFn && themeFn(props, theme)
      return createElement(element, last.current.props, props.children)
    }

    const dynClassNames = addDynamicStyles(
      id,
      ThemedView.displayName,
      conditionalStyles,
      dynClasses.current,
      props,
      themeFn,
      theme,
    )

    dynClasses.current = dynClassNames

    const isDOMElement = typeof element === 'string' || config!.isDOMElement

    // set up final props with filtering for various attributes
    let finalProps: any = {}

    if (isDOMElement) {
      for (const key in props) {
        if (ignoreAttrs && ignoreAttrs[key]) continue
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
      }
    } else {
      for (const key in props) {
        if (conditionalStyles && conditionalStyles[key]) continue
        finalProps[key] = props[key]
      }
    }

    // we control these props
    if (staticClasses || dynClassNames.size) {
      finalProps.className = staticClasses
        ? [...staticClasses, ...dynClassNames].join(' ')
        : [...dynClassNames].join(' ')
    }
    finalProps['data-is'] = finalProps['data-is'] || ThemedView.displayName

    // hook: setting your own props
    const postProcessProps = config!.postProcessProps
    if (postProcessProps) {
      postProcessProps(props, finalProps, tracker)
    }

    if (process.env.NODE_ENV === 'development') {
      // @ts-ignore
      if (props.debug) {
        console.log(
          'styles\n',
          finalProps.className
            .split(' ')
            .map(x => tracker.get(x.replace(/^s/, '')))
            .filter(Boolean),
          '\nprops\n',
          props,
          '\nfinalProps\n',
          finalProps,
        )
      }
    }

    last.current.props = finalProps
    return createElement(element, finalProps, props.children)
  }

  const internal: GlossInternals<Props> = {
    themeFns: null,
    parent: hasGlossyParent ? target : null,
    getConfig: () => ({
      config: ogConfig,
      id,
      displayName: ThemedView.displayName || '',
      targetElement,
      styles: { ...Styles.styles },
      conditionalStyles: { ...Styles.conditionalStyles },
    }),
  }

  let ThemedView = createGlossView<Props>(GlossView, internal)

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
      ThemedView = createGlossView<Props>(GlossView, internal)
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
  }

  // TODO this any type is a regression from adding ThemeProps
  return ThemedView as any
}

function createGlossView<Props>(GlossView: any, config) {
  const { isEqual, shouldUpdateMap } = createGlossIsEqual()
  GlossView.shouldUpdateMap = shouldUpdateMap
  const res: GlossView<Props> = memo(GlossView, isEqual) as any
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
  const hasFocus = x.indexOf('&:focus') > -1 ? 1 : 0
  const hasHover = x.indexOf('&:hover') > -1 ? 2 : 0
  const hasActive = x.indexOf('&:active') > -1 ? 3 : 0
  const psuedoScore = hasActive + hasHover + hasFocus
  if (psuedoScore) return psuedoScore
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
  let classNames: string[] | null = null
  for (const key of keys) {
    const rules = styles[key]
    // they may return falsy, conditional '&:hover': active ? hoverStyle : null
    if (!rules) continue

    // add the stylesheets and classNames
    // TODO could do a simple "diff" so that fast-changing styles only change the "changing" props
    // it would likely help things like when you animate based on mousemove, may be slower in default case
    const className = addRules(displayName, rules, key, moreSpecific)
    classNames = classNames || []
    classNames.push(className)

    // if this is the first mount render or we didn't previously have this class then add it as new
    if (!prevClassNames || !prevClassNames.has(className)) {
      gc.registerClassUse(className)
    }
  }
  return classNames
}

function mergePropStyles(baseId: string, styles: Object, propStyles: Object, props: Object) {
  for (const key in propStyles) {
    if (props[key] !== true) continue
    for (const sKey in propStyles[key]) {
      const ns = sKey === 'base' ? baseId : sKey
      styles[ns] = styles[ns] || {}
      mergeStyles(ns, styles, propStyles[key][sKey], true)
    }
  }
}

const SPECIFIC_PREFIX = 's'

function deregisterClassName(name: string) {
  const nonSpecificClassName = name[0] === SPECIFIC_PREFIX ? name.slice(1) : name
  gc.deregisterClassUse(nonSpecificClassName)
}

const isNumericString = (x: string | number) => +x == x

function addDynamicStyles(
  id: string,
  displayName: string = 'g',
  conditionalStyles: Object | undefined,
  prevClassNames: Set<string> | null,
  props: CSSPropertySet,
  themeFn?: ThemeFn | null,
  theme?: ThemeObject,
) {
  const dynStyles = {}
  let classNames = new Set<string>()

  // applies styles most important to least important
  // that saves us some processing time (no need to set multiple times)
  // note that means the topmost `mergeStyles` will apply as most important

  // if passed any classes from a parent gloss view, merge them, ignore classname and track
  if (props.className) {
    const propClassNames = props.className.split(whiteSpaceRegex)
    // note this reverse: this is a bit odd
    // right now we have conditionalStyles applied as their own className (so base: .1, conditional: .2)
    // then we pass className="1 2" if we have a parent that the conditional style === true
    // what we probably want is to merge them all into their own single className
    // until then, we need to preserve the important order, so we reverse to make sure conditional applies first
    const len = propClassNames.length
    for (let i = len - 1; i >= 0; i--) {
      const className = propClassNames[i]
      const cn = className[0] === SPECIFIC_PREFIX ? className.slice(1) : className
      const info = tracker.get(cn)
      if (info) {
        // curId is looking if info.namespace was &:hover (sub-select) or "123" (base) and then applying
        // otherwise it would apply hover styles to the base styles here
        const curId = isNumericString(info.namespace) ? id : info.namespace
        dynStyles[curId] = dynStyles[curId] || {}
        mergeStyles(curId, dynStyles, info.rules)
      } else if (className) {
        classNames.add(className)
      }
    }
  }

  if (conditionalStyles) {
    mergePropStyles(id, dynStyles, conditionalStyles, props)
  }

  if (theme && themeFn) {
    const next = Config.preProcessTheme ? Config.preProcessTheme(props, theme) : theme
    dynStyles[id] = dynStyles[id] || {}
    const themeStyles = themeFn(props, next)
    const themePropStyles = mergeStyles(id, dynStyles, themeStyles, true)
    if (themePropStyles) {
      mergePropStyles(id, dynStyles, themePropStyles, props)
    }
  }

  // add dyn styles
  const dynClassNames = addStyles(dynStyles, displayName, prevClassNames, true)
  if (dynClassNames) {
    for (const cn of dynClassNames) {
      classNames.add(cn)
    }
  }

  // check what classNames have been removed if this is a secondary render
  if (prevClassNames) {
    for (const className of prevClassNames) {
      // if this previous class isn't in the current classes then deregister it
      if (!classNames.has(className)) {
        deregisterClassName(className)
      }
    }
  }

  return classNames
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
  nextStyles?: CSSPropertySet | null,
  overwrite?: boolean,
): Object | undefined {
  // this is just for the conditional prop styles
  let propStyles
  for (const key in nextStyles) {
    // dont overwrite as we go down
    if (overwrite !== true && baseStyles[id][key] !== undefined) {
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
      let isMediaQuery = false
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
            isMediaQuery = true
          }
        }
      }

      if (!isMediaQuery) {
        let subStyles = nextStyles[key]
        // catch invalid/falsy
        if (!subStyles || typeof subStyles !== 'object') {
          continue
        }
        // propStyles
        //   definition: gloss({ isTall: { height: '100%' } })
        //   usage: <Component isTall />

        propStyles = propStyles || {}
        propStyles[key] = {}

        // they can nest (media queries/psuedoes), split it out, eg:
        //  gloss({
        //    isTall: {
        //      '&:before': {}
        //    }
        //  })
        for (const sKey in subStyles) {
          // key = isTall
          // sKey = &:before
          if (isSubStyle(sKey)) {
            // keep all sub-styles on their key
            propStyles[key] = propStyles[key] || {}
            propStyles[key][sKey] = subStyles[sKey]
          } else {
            // we put base styles here, see 'base' check above
            propStyles[key].base = propStyles[key].base || {}
            propStyles[key].base[sKey] = subStyles[sKey]
          }
        }
      }
    }
  }

  return propStyles
}

// happens once at initial gloss() call, so not as perf intense
// get all parent styles and merge them into a big object
function getAllStyles(
  baseId: string,
  config: GlossInternalConfig | null,
  rawStyles: CSSPropertySet | null,
) {
  const styles = {
    [baseId]: {},
  }
  let conditionalStyles = mergeStyles(baseId, styles, rawStyles)
  // merge parent styles
  if (config) {
    const parentPropStyles = config.conditionalStyles
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
    const parentStyles = config.styles
    const parentId = config.id
    const moveToMyId = parentStyles[parentId]
    delete parentStyles[parentId]
    parentStyles[baseId] = moveToMyId
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
  }
}

/**
 * We need to compile a few things to get the config right:
 *   1. get all the parents postProcessProps until:
 *   2. encounter a parent with getElement (and use that isDOMElement)
 *   3. stop there, don't keep going higher
 */
function getCompiledConfig(
  viewOG: GlossView<any>,
  config: GlossViewOpts<any> | null,
): GlossViewOpts<any> {
  const compiledConf: GlossViewOpts<any> = { ...config }
  let cur = viewOG
  while (cur) {
    const curConf = cur.internal.getConfig().config
    if (curConf) {
      if (curConf.postProcessProps) {
        // merge the postProcessProps
        const og = compiledConf.postProcessProps
        if (curConf.postProcessProps !== og) {
          compiledConf.postProcessProps = og
            ? (a, b) => {
                og(a, b, tracker)
                curConf.postProcessProps!(a, b, tracker)
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
function compileTheme(viewOG: GlossView<any>) {
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

  return (props: Object, theme: ThemeObject) => {
    let styles: CSSPropertySetLoose | null = null
    for (const themeFn of themes) {
      const next = themeFn(props, theme, styles)
      if (next) {
        styles = styles || {}
        Object.assign(styles, next)
      }
    }
    return styles
  }
}

// adds rules to stylesheet and returns classname
function addRules(displayName = '_', rules: BaseRules, namespace: string, moreSpecific?: boolean) {
  const style = cssString(rules)

  // build the class name with the display name of the styled component and a unique id based on the css and namespace
  // ensure we are unique for unique namespaces, TODO we could not add it to hash and just have a separate
  // tracker check below like tracker.get(className).has(namespace) or something similar
  const className = styleToClassName(style + (isSubStyle(namespace) ? namespace : ''))

  // this is the first time we've found this className
  if (!tracker.has(className)) {
    // build up the correct selector, explode on commas to allow multiple selectors
    const selector = getSelector(className, namespace)
    // insert the new style text
    tracker.set(className, {
      displayName,
      namespace,
      rules,
      selector,
      style,
      className,
    })

    if (namespace[0] === '@') {
      sheet.insert(namespace, `${namespace} {${selector} {${style}}}`)
    } else {
      sheet.insert(className, `${selector} {${style}}`)
    }
  }

  return moreSpecific ? `${SPECIFIC_PREFIX}${className}` : className
}

// has to return a .s-id and .id selector for use in parents passing down styles
function getSelector(className: string, namespace: string) {
  if (namespace[0] === '@') {
    // double specificity hack
    return `.${className}.${className}, body .${SPECIFIC_PREFIX}${className}.${SPECIFIC_PREFIX}${className}`
  }
  if (namespace.indexOf('&') !== -1) {
    // namespace === '&:hover, &:focus, & > div'
    const namespacedSelectors = namespace
      .split(',')
      .flatMap(part => {
        const selector = part.replace('&', className).trim()
        return [`body .${SPECIFIC_PREFIX}${selector}`, `.${selector}`]
      })
      .join(',')
    return namespacedSelectors
  }
  return `body .${SPECIFIC_PREFIX}${className}, .${className}`
}

if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
  window['gloss'] = window['gloss'] || {
    tracker,
    gc,
    sheet,
    validCSSAttr,
  }
}

/**
 * For use externally only (static style extract)
 */
export function getStylesClassName(namespace: string, styles: CSSPropertySet) {
  const style = cssString(styles)
  let className = styleToClassName(style + (isSubStyle(namespace) ? namespace : ''))
  const selector = getSelector(className, namespace)
  className = `${SPECIFIC_PREFIX}${className}`
  let css: string
  if (namespace[0] === '@') {
    css = `${namespace} {${selector} {${style}}}`
  } else {
    css = `${selector} {${style}}`
  }
  return { css, className }
}
