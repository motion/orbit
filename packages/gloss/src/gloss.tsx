import { CSSPropertySet, CSSPropertySetLoose, cssStringWithHash, stringHash, validCSSAttr } from '@o/css'
import React from 'react'
import { createElement, isValidElement, memo, useEffect, useRef } from 'react'

import { Config } from './configureGloss'
import { createGlossIsEqual } from './createGlossIsEqual'
import { validPropLoose, ValidProps } from './helpers/validProp'
import { styleKeysSort } from './styleKeysSort'
import { GarbageCollector, StyleTracker } from './stylesheet/gc'
import { StyleSheet } from './stylesheet/sheet'
import { CompiledTheme } from './theme/createTheme'
import { createThemeProxy } from './theme/createThemeProxy'
import { pseudoProps } from './theme/pseudos'
import { themeVariableManager } from './theme/ThemeVariableManager'
import { ThemeTrackState, UnwrapThemeSymbol, useTheme } from './theme/useTheme'
import { defaultTheme } from './themes/defaultTheme'
import { GlossProps, GlossPropsPartial, GlossThemeProps, GlossViewConfig } from './types'

// so you can reference in postProcessProps
export { StyleTracker } from './stylesheet/gc'

// why is this global/mutable? because its in the most sensitive area perf-wise,
// otherwise we'd be passing in an object to css() every time, which is called thousands of times
// for now set curTheme = defaultTheme so dynamics can use it... this is a bit jank due to curTheme being global
// curTheme is used at startup when getGlossProps runs
let curTheme = defaultTheme

/**
 * Note: ThemeProps is optional, for the user to define that they are
 * filtering out props before they get to `theme`, which is helpful for keeping
 * their types simple. It's still relatively low level. See our @o/ui/View.tsx
 */
export interface GlossView<RawProps = {}, P = GlossProps<RawProps>> {
  (props: P, context?: any): React.ReactElement<any> | null
  defaultProps?: Partial<P>
  displayName?: string
  ignoreAttrs?: { [key: string]: boolean }
  theme: (...themeFns: ThemeFn<RawProps>[]) => this
  // internals
  readonly internal: GlossInternals<P>
  readonly shouldUpdateMap: WeakMap<object, boolean>
  compile?: () => void
  staticStyleConfig?: {
    parentView?: GlossView<any>
    cssAttributes?: Object
    deoptProps?: string[]
    avoidProps?: string[]
    tagName?: string
  }
}

export interface ThemeFn<RawProps = any> {
  (
    themeProps: GlossThemeProps<RawProps>,
    previous?: RawProps & CSSPropertySetLoose | null,
  ): CSSPropertySetLoose | void | null
  hoistTheme?: boolean
}

type GlossInternals<Props = any> = {
  depth: number
  parent: any
  targetElement: any
  themeFns: ThemeFn<Props>[] | null
  compiledInfo?: GlossStaticStyleDescription
  glossProps: GlossParsedProps<Props>
  getConfig: () => {
    displayName: string
    themeFns: ThemeFn[][] | null
  }
}

type GlossParsedProps<Props = any> = {
  staticClasses: string[] | null
  config: GlossViewConfig<Props> | null
  defaultProps: Partial<Props> | null
  internalDefaultProps: any
  styles: Object | null
  conditionalStyles: Object | null
}

export type GlossStaticStyleDescription = {
  className: string
  conditionalClassNames?: {
    [key: string]: string
  }
}

const GlossComponentSymbol = Symbol('__GLOSS_SIMPLE_COMPONENT__') as any
export const tracker: StyleTracker = new Map()
export const sheet = new StyleSheet(true)
const gc = new GarbageCollector(sheet, tracker)

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
  let glossPropsObject: GlossProps | null = (b as any) ?? null
  const hasGlossyParent = !!target[GlossComponentSymbol]

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
    glossPropsObject = (a as any) ?? null
  }

  const depth = hasGlossyParent ?
    target.internal.depth + 1 :
    // note: target may be a class component (not a string)
    // in this case assume were 1 depth because it accepts gloss className
    typeof target !== 'string' ?
      1 : 0
  const targetElement = hasGlossyParent ? target.internal.targetElement : target
  const glossProps = getGlossProps(glossPropsObject ?? null, hasGlossyParent ? target : null, depth)
  const config = glossProps.config
  const getEl = config?.getElement
  const staticClassNames = glossProps.staticClasses?.join(' ') ?? ''
  const conditionalStyles = glossProps.conditionalStyles
  const ignoreAttrs = glossProps.defaultProps?.ignoreAttrs ?? (hasGlossyParent && target.ignoreAttrs) ?? baseIgnoreAttrs
  // static compilation information
  const { compiledClassName, conditionalClassNames } = getCompiledClasses(target, compiledInfo || null, depth)

  // put the "rest" of non-styles onto defaultProps
  GlossView.defaultProps = glossProps.defaultProps

  let themeFns: ThemeFn[][] | null = null
  let hasCompiled = false
  let shouldUpdateMap: WeakMap<any, boolean>

  // this compiles later to capture theme/displayname
  function compile() {
    if (hasCompiled) return
    hasCompiled = true
    shouldUpdateMap = GlossView['shouldUpdateMap']
    themeFns = compileThemes(ThemedView)
  }

  setTimeout(compile, 0)

  // debug
  if (isDeveloping && glossPropsObject?.['debug']) {
    console.warn('gloss info', { glossProps, depth })
  }

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
    if (!hasCompiled) {
      compile()
    }

    const theme = useTheme(props)
    curTheme = theme[UnwrapThemeSymbol]
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
      shouldDebug = false
      return createElement(element, last.current.props, props.children)
    }

    // set up final props with filtering for various attributes
    let finalProps: any = {}

    let avoidStyles = false
    if (config?.shouldAvoidProcessingStyles) {
      avoidStyles = config.shouldAvoidProcessingStyles(props)
    }

    const dynStyles = addDynamicStyles(
      ThemedView.displayName,
      conditionalStyles,
      dynClasses.current,
      depth,
      theme as any,
      themeFns,
      avoidStyles,
    )
    dynClasses.current = curDynClassNames

    const isDOMElement = typeof element === 'string' || (config ? config.isDOMElement : false)

    let className = staticClassNames
    if (props.className) {
      className += ` ${props.className}`
    }
    if (curDynClassNames.size) {
      className += ' ' + [...curDynClassNames].join(' ')
    }
    if (compiledClassName) {
      className += compiledClassName
    }

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
          ...glossProps.styles?.['.'],
          ...dynStyles['.'],
        }
      })
    }

    if (isDeveloping && shouldDebug) {
      const styles = finalProps.className
        .split(' ')
        .map(x => tracker.get(x.slice(2)))
        .filter(Boolean)
      console.log('styles\n', styles, '\nprops\n', props, '\noutProps\n', finalProps)
      shouldDebug = false
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
    depth,
    getConfig: () => ({
      displayName: ThemedView.displayName || '',
      themeFns,
    }),
  }

  let ThemedView = createGlossView(GlossView, internal)
  ThemedView.compile = compile

  // inherit default props
  if (hasGlossyParent) {
    ThemedView.defaultProps = target.defaultProps
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
  res[GlossComponentSymbol] = true
  res.theme = (...themeFns) => {
    config.themeFns = themeFns
    return res
  }
  return res
}

// takes a style object, adds it to stylesheet, returns classnames
function addStyles(
  styles: any,
  depth: number,
  displayName?: string,
  prevClassNames?: Set<string> | null,
  selectorPrefix?: string
) {
  const namespaces = getSortedNamespaces(styles)
  let classNames: string[] | null = null
  for (const ns of namespaces) {
    const style = styles[ns]
    // they may return falsy, conditional '&:hover': active ? hoverStyle : null
    if (!style) continue

    // add the stylesheets and classNames
    // TODO could do a simple "diff" so that fast-changing styles only change the "changing" props
    // it would likely help things like when you animate based on mousemove, may be slower in default case
    const className = addRules(displayName, style, ns, depth || 0, selectorPrefix, true)

    if (className) {
      classNames = classNames || []
      classNames.push(className)
      // if this is the first mount render or we didn't previously have this class then add it as new
      if (!prevClassNames || !prevClassNames.has(className)) {
        gc.registerClassUse(className.slice(2))
      }
    }
  }
  if (isDeveloping && shouldDebug) {
    console.log('addStyles sorted', classNames, namespaces, styles)
  }
  return classNames
}

// sort pseudos into priority
const getSortedNamespaces = (styles: any) => {
  const keys = Object.keys(styles)
  if (keys.length > 1) {
    keys.sort(styleKeysSort)
  }
  return keys
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

function deregisterClassName(name: string) {
  // slice 2 to remove specifity
  gc.deregisterClassUse(name.slice(2))
}

let curDynClassNames = new Set<string>()
function addDynamicStyles(
  displayName: string = 'g',
  conditionalStyles: Object | null,
  prevClassNames: Set<string> | null,
  depth: number,
  theme: GlossThemeProps,
  themeFns?: ThemeFn[][] | null,
  avoidStyles?: boolean,
) {
  const dynStyles = {}
  curDynClassNames = new Set<string>()

  if (!avoidStyles) {
    if (conditionalStyles) {
      mergePropStyles(dynStyles, conditionalStyles, theme)
    }
    if (theme && themeFns) {
      const len = themeFns.length - 1
      for (const [index, themeFnList] of themeFns.entries()) {
        const themeDepth = depth - (len - index)
        const themeStyles = getStylesFromThemeFns(themeFnList, theme)
        // TODO is this bad perf? now that we always create an object for themes
        // the next block would always execute, but there are times themes do nothing
        // not sure its worth checking keys here but it avoids object creation in the block
        // i really wish js added shit like themeStyles.keysLength or something
        if (Object.keys(themeStyles).length) {
          dynStyles['.'] = dynStyles['.'] || {}
          // make an object for each level of theme
          const curThemeObj = { ['.']: {} }
          mergeStyles('.', curThemeObj, themeStyles, true)
          // TODO console.log this see if we can optimize
          Object.assign(dynStyles['.'], curThemeObj['.'])
          // `html ` prefix makes it slightly stronger than the glossProp styles
          const dynClassNames = addStyles(curThemeObj, themeDepth, displayName, prevClassNames, 'html ')
          if (dynClassNames) {
            for (const cn of dynClassNames) {
              curDynClassNames.add(cn)
            }
          }
        }
      }
    }
  }
  // de-register removed classNames
  if (prevClassNames) {
    for (const className of prevClassNames) {
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
// const staticClasses: string[] | null = addStyles(glossProps.styles, depth)
export function getGlossProps(allProps: GlossProps | null, parent: GlossView | null, depth: number): GlossParsedProps {
  const { config = null, ...rest } = allProps || {}
  const styles = {
    '.': {},
  }
  // all the "rest" go onto default props
  let defaultProps: any = allProps
  let conditionalStyles = mergeStyles('.', styles, rest, false, defaultProps) ?? null
  const internalDefaultProps = defaultProps
  // merge parent config
  if (parent?.internal) {
    const parentGlossProps = parent.internal.glossProps
    if (parentGlossProps.defaultProps) {
      defaultProps = {
        ...parentGlossProps.defaultProps,
        ...defaultProps,
      }
    }
    const parentPropStyles = parentGlossProps.conditionalStyles
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
  }
  // merge together the parent chain of static classes
  const curStaticClasses = addStyles(styles, depth) || []
  const parentStaticClasses = parent?.internal?.glossProps.staticClasses || []
  return {
    staticClasses: [...parentStaticClasses, ...curStaticClasses],
    config: config ? compileConfig(config, parent) : null,
    styles,
    conditionalStyles,
    defaultProps,
    internalDefaultProps,
  }
}

/**
 * We need to compile a few things to get the config right:
 *   1. get all the parents postProcessProps until:
 *   2. encounter a parent with getElement (and use that isDOMElement)
 *   3. stop there, don't keep going higher
 */
function compileConfig(
  config: GlossViewConfig | null,
  parent: GlossView | null,
): GlossViewConfig {
  const compiledConf: GlossViewConfig = { ...config }
  let cur = parent
  while (cur) {
    const parentConf = cur.internal.glossProps.config
    if (parentConf) {
      if (parentConf.postProcessProps) {
        // merge the postProcessProps
        const og = compiledConf.postProcessProps
        if (parentConf.postProcessProps !== og) {
          compiledConf.postProcessProps = og
            ? (a, b, c) => {
                og(a, b, c)
                parentConf.postProcessProps!(a, b, c)
              }
            : parentConf.postProcessProps
        }
      }
      // find the first getElement and break here
      if (parentConf.getElement) {
        compiledConf.getElement = parentConf.getElement
        compiledConf.isDOMElement = parentConf.isDOMElement
        break
      }
    }
    cur = cur.internal.parent
  }
  return compiledConf
}

// compile theme from parents
function compileThemes(viewOG: GlossView) {
  let cur = viewOG
  const hasOwnTheme = cur.internal.themeFns

  // this is a list of a list of theme functions
  // we run theme functions from parents before, working down to ours
  // the parent ones have a lower priority, so we want them first
  const added = new Set()
  let all: ThemeFn[][] = []
  const hoisted: ThemeFn[] = []

  // get themes in order from most important (current) to least important (grandparent)
  while (cur) {
    const conf = cur.internal
    if (conf.themeFns) {
      let curThemes: ThemeFn[] = []
      for (const fn of conf.themeFns) {
        if (added.has(fn)) {
          continue // prevent duplicates in parents
        }
        added.add(fn)
        if (fn.hoistTheme) {
          hoisted.push(fn)
        } else {
          curThemes.push(fn)
        }
      }
      if (curThemes.length) {
        all.push(curThemes)
      }
    }
    cur = conf.parent
  }

  // reverse so we have [grandparent, parent, cur]
  all.reverse()

  // we need to make sure theme priority is either above or below the static styles, depending.
  // so if:
  //   const Parent = gloss({ background: 'red' }).theme(changeBg)
  //       changeBg *should* override background
  // but if:
  //   const Child = gloss(Parent, { background: 'green' })
  //       background will *always* be green
  // ALSO if changeBg.hoistTheme = true, we need to be sure its hoisted all the way up
  // by putting an empty theme at the front if there are child themes, but no current theme,
  // we ensure that the hoisted will always go at the top, as well as ensuring the depth/priority
  // is kept as it should be
  if (all.length && !hasOwnTheme) {
    all.push([])
  }

  // hoisted always go onto starting of the cur theme
  if (hoisted.length) {
    all[all.length - 1] = [
      ...hoisted,
      ...all[all.length - 1]
    ]
  }

  const themes = all.filter(Boolean)

  if (!themes.length) {
    return null
  }

  return themes
}

function getStylesFromThemeFns(themeFns: ThemeFn[], themeProps: Object) {
  let styles: CSSPropertySetLoose = {}
  for (const themeFn of themeFns) {
    const next = themeFn(themeProps as any, styles)
    if (next) {
      styles = styles || {}
      Object.assign(styles, next)
    }
  }
  return styles
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

const parentKeys = {}
const createParentKey = (k: string) => {
  const next = '-' + k.replace(/\s+/g, '')
  parentKeys[k] = next
  return next
}

function addRules<A extends boolean>(
  displayName = '_',
  rules: BaseRules,
  namespace: string,
  depth: number,
  selectorPrefix?: string,
  insert?: A,
): (A extends true ? string : {
  css: string,
  className: string
}) | null {
  const [hash, style] = cssStringWithHash(rules, cssOpts)

  // empty object, no need to add anything
  if (!hash) {
    return null
  }

  let className = `${hash}`
  // build the class name with the display name of the styled component and a unique id based on the css and namespace
  // ensure we are unique for unique namespaces
  if (namespace !== '.') {
    const postfix = nicePostfix[namespace] || stringHash(namespace)
    className += `-${postfix}`
  }
  if (selectorPrefix) {
    className += parentKeys[selectorPrefix] || createParentKey(selectorPrefix)
  }

  const isMediaQuery = namespace[0] === '@'
  const selector = getSelector(className, namespace, selectorPrefix)
  const css = isMediaQuery ? `${namespace} {${selector} {${style}}}` : `${selector} {${style}}`
  const finalClassName = `g${depth}${className}`

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
function getSelector(className: string, namespace: string, selectorPrefix = '') {
  if (namespace[0] === '@') {
    // media queries need stronger binding, we'll do html selector
    return getSpecificSelectors(className, selectorPrefix + 'body')
  }
  if (namespace[0] === '&' || namespace.indexOf('&') !== -1) {
    // namespace === '&:hover, &:focus, & > div'
    const namespacedSelectors = namespace
      .split(',')
      .flatMap(part => {
        return getSpecificSelectors(className, selectorPrefix, part.replace('&', ''))
      })
      .join(',')
    return namespacedSelectors
  }
  return getSpecificSelectors(className, selectorPrefix)
}

// for now, assume now more than 6 levels nesting (css = 🤮)
const depths = [0, 1, 2, 3, 4, 5]
const dSelectors = depths.map(i => i === 0 ? '' : `._g${i}`.repeat(i))
function getSpecificSelectors(base: string, parent = '', after = '') {
  let s: string[] = []
  for (const i of depths) {
    s.push(`${parent}${dSelectors[i]} .g${i}${base}${after}`)
  }
  return s.join(',')
}


// some internals we can export
if (typeof window !== 'undefined') {
  window['gloss'] = window['gloss'] || {
    tracker,
    gc,
    sheet,
    validCSSAttr,
    themeVariableManager,
  }
}

export const isGlossView = (view: any): boolean => {
  return view && !!view[GlossComponentSymbol]
}

export const baseIgnoreAttrs = {
  ...validCSSAttr,
  width: false,
  height: false,
  size: false,
  src: false,
}

function getCompiledClasses(parent: GlossView | any, compiledInfo: GlossStaticStyleDescription | null, depth: number) {
  const conditionalClassNames = compiledInfo?.conditionalClassNames ?? {}
  let compiledClassName = ' ' + (compiledInfo?.className ?? '')
  // go up parents and add compiled info
  // depth starts at highest (strongest) and goes down as it goes to grandparents
  let p = parent
  let d = depth - 1
  // compiled classNames inheritance
  while(p?.internal) {
    const info = p.internal.compiledInfo
    if (info?.conditionalClassNames) {
      // merge in parents conditionals (if not defined)
      for (const key in info?.conditionalClassNames) {
        if (conditionalClassNames[key]) continue
        conditionalClassNames[key] = replaceDepth(info.conditionalClassNames[key], d)
      }
    }
    if (info?.className) {
      const pClassName = info.className.trim().split(' ').map(x => replaceDepth(x, d)).join(' ')
      compiledClassName += ` ${pClassName}`
    }
    p = p.internal.parent
    d--
  }
  return { compiledClassName, conditionalClassNames }
}

const replaceDepth = (className: string, depth: number) => {
  return className[0] === 'g' && +className[1] == +className[1] ? `g${depth}${className.slice(2)}` : className
}

/**
 * START external static style block (TODO move out to own thing)
 *
 * keeping it here for now because dont want to add more fns in sensitive loops above
 * this is a really hacky area right now as im just trying to figure out the right way
 * to do all of this, once it settles into something working we can set up some tests,
 * some performance checks, and then hopefully dedupe this code with the code above +
 * split it out and make it all a lot more clearly named/structured.
 */

export type StaticStyleDesc = {
  css: string,
  className: string;
  ns: string
}

function getAllStyles(props: any, depth = 0) {
  if (!props) {
    return []
  }
  const allStyles = { ['.']: {} }
  mergeStyles('.', allStyles, props)
  const styles: StaticStyleDesc[] = []
  const namespaces = getSortedNamespaces(allStyles)
  for (const ns of namespaces) {
    const styleObj = allStyles[ns]
    if (!styleObj) continue
    const info = addRules('', styleObj, ns, depth, '', false)
    if (info) {
      styles.push({ ns, ...info, })
    }
  }
  return styles
}

/**
 * For use externally only (static style extract)
 */
function getStyles(props: any, depth = 0) {
  return getAllStyles(props, depth)[0] ?? null
}

/**
 * For use externally only (static style extract)
 * see addDynamicStyles equivalent
 */
export type ThemeStyleInfo = {
  trackState: ThemeTrackState | null,
  themeStyles: StaticStyleDesc[] | null
}

function getThemeStyles(view: GlossView, userTheme: CompiledTheme, props: any, extraDepth = 0): ThemeStyleInfo {
  const themeFns = compileThemes(view)
  if (!themeFns) {
    return {
      themeStyles: null,
      trackState: null,
    }
  }
  const trackState: ThemeTrackState = {
    theme: userTheme,
    hasUsedOnlyCSSVariables: true,
    nonCSSVariables: new Set(),
    usedProps: new Set()
  }
  // themes always one above, extraDepth if theres a local view
  const depth = view.internal.depth + 1 + extraDepth
  const themeStyles: StaticStyleDesc[] = []
  const len = themeFns.length - 1
  const theme = createThemeProxy(userTheme, trackState, props)
  for (const [index, themeFnList] of themeFns.entries()) {
    const themeDepth = depth - (len - index)
    const styles = getStylesFromThemeFns(themeFnList, theme)
    if (Object.keys(styles).length) {
      // make an object for each level of theme
      const curThemeObj = { ['.']: {} }
      mergeStyles('.', curThemeObj, styles, true)
      const namespaces = getSortedNamespaces(curThemeObj)
      for (const ns of namespaces) {
        const styleObj = curThemeObj[ns]
        if (!styleObj) continue
        const info = addRules('', styleObj, ns, themeDepth, 'html ', false)
        if (info) {
          themeStyles.push({ ns, ...info, })
        }
      }
    }
  }
  return { themeStyles, trackState }
}

export const StaticUtils = { getAllStyles, getStyles, getThemeStyles }

/**
 * END external static style block
 */
