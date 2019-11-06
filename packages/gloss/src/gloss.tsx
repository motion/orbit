import { CAMEL_TO_SNAKE, cssAttributeAbbreviations, CSSPropertySet, CSSPropertySetLoose, cssValue, SHORTHANDS, stringHash, validCSSAttr } from '@o/css'
import React from 'react'
import { createElement, isValidElement, memo, useEffect, useRef } from 'react'

import { Config } from './configureGloss'
import { createGlossIsEqual } from './createGlossIsEqual'
import { validPropLoose, ValidProps } from './helpers/validProp'
import { styleKeysSort } from './styleKeysSort'
import { GarbageCollector, StyleTracker } from './stylesheet/gc'
import { StyleSheet } from './stylesheet/sheet'
import { CompiledTheme } from './theme/createTheme'
import { pseudoProps } from './theme/pseudos'
import { themeVariableManager } from './theme/ThemeVariableManager'
import { UnwrapThemeSymbol, useTheme } from './theme/useTheme'
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

type ClassNamesByNs = ({ [key: string]: ClassNames } | null)

type GlossParsedProps<Props = any> = {
  staticClasses: string[] | null
  statics: ClassNamesByNs[]
  config: GlossViewConfig<Props> | null
  defaultProps: Partial<Props> | null
  internalDefaultProps: any
  styles: Object | null
}

export type GlossStaticStyleDescription = {
  className: string
  conditionalClassNames?: {
    [key: string]: string
  }
}

const GlossComponentSymbol = Symbol('__GLOSS_SIMPLE_COMPONENT__') as any
export const tracker: StyleTracker = new Map()
export const sheet = new StyleSheet(false)
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
  const glossProps = getGlossProps(glossPropsObject ?? null, hasGlossyParent ? target : null)
  const config = glossProps.config
  const staticClassNames = glossProps.staticClasses?.join(' ') ?? ''

  // calc before render
  const ignoreAttrs = glossProps.defaultProps?.ignoreAttrs ?? (hasGlossyParent && target.ignoreAttrs) ?? baseIgnoreAttrs
  const getEl = config?.getElement

  // static compilation information
  // just add conditional classnames right away, they are small
  const { compiledClassName, conditionalClassNames } = getCompiledClasses(target, compiledInfo || null, depth)

  //!
  // for (const key in glossProps.conditionalStyles) {
  //   const names = addStyles(glossProps.conditionalStyles[key])
  //   if (names) {
  //     conditionalClassNames[key] = names.join(' ')
  //   }
  // }

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
    console.warn('gloss info', { glossProps })
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
    const dynClasses = useRef<string[] | null>(null)

    // for smarter update tracking
    const last = useRef<{ props: Object; theme: CompiledTheme }>()
    let shouldAvoidStyleUpdate = false
    if (!last.current) {
      last.current = { props, theme }
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
        if (!x || !x.length) return
        for (const cn of x) {
          deregisterClassName(cn)
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

    const dynClassNames = []
    dynClasses.current = dynClassNames

    const isDOMElement = typeof element === 'string' || (config ? config.isDOMElement : false)

    for (const key in props) {
      if (conditionalClassNames[key]) continue
      if (isDOMElement) {
        if (ignoreAttrs[key]) continue
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
        finalProps[key] = props[key]
      }
    }

    const classNames = getClassNames(theme, themeFns || [], glossProps.statics)
    console.log('got em', glossProps, classNames)
    finalProps.className = classNames.join(' ')
    // let className = staticClassNames
    // if (props.className) {
    //   className += ` ${props.className}`
    // }
    // if (dynClassNames.length) {
    //   className += ' ' + dynClassNames.join(' ')
    // }
    // if (compiledClassName) {
    //   className += compiledClassName
    // }

    if (isDeveloping) {
      finalProps['data-is'] = finalProps['data-is'] || ThemedView.displayName
    }

    // hook: setting your own props
    const postProcessProps = config && config.postProcessProps
    if (postProcessProps) {
      postProcessProps(props, finalProps, () => getStylesForClassNames(classNames))
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

function getStylesForClassNames(_classNames: string[]) {
  // TODO
  console.log('todo')
  return {}
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
  displayName?: string,
  curClassNames?: string[],
  prevClassNames?: string[] | null,
) {
  const namespaces = getSortedNamespaces(styles)
  let allClassNames: string[] | null = null
  for (const ns of namespaces) {
    const style = styles[ns]
    // they may return falsy, conditional '&:hover': active ? hoverStyle : null
    if (!style) continue

    const next = addRules(displayName, style, ns, true)
    const nextClassNames = Object.values(next) as any

    // TODO optimize/refactor, just getting working
    let classNames: string[] = []
    if (curClassNames) {
      for (const cn of nextClassNames) {
        const prefix = getPrefix(cn)
        if (curClassNames.some(x => x.indexOf(prefix) === 0) === false) {
          classNames.push(cn)
        }
      }
    } else {
      classNames = nextClassNames
    }

    if (classNames.length) {
      allClassNames = allClassNames || []
      // @ts-ignore
      allClassNames = [...allClassNames, ...classNames]
      // if this is the first mount render or we didn't previously have this class then add it as new
      for (const className of classNames) {
        if (!prevClassNames || !prevClassNames.includes(className)) {
          gc.registerClassUse(className)
        }
      }
    }
  }
  if (isDeveloping && shouldDebug) {
    console.log('addStyles sorted', allClassNames, namespaces, styles)
  }
  return allClassNames
}

// sort pseudos into priority
export const getSortedNamespaces = (styles: any) => {
  const keys = Object.keys(styles)
  if (keys.length > 1) {
    keys.sort(styleKeysSort)
  }
  return keys
}

function mergePropStyles(styles: Object, propStyles: Object, props: Object) {
  for (const key in propStyles) {
    if (props[key] !== true) continue
    const stylesByNs = propStyles[key]
    for (const ns in propStyles[key]) {
      styles[ns] = styles[ns] || {}
      mergeStyles(ns, styles, stylesByNs[ns], true)
      console.log('check', key, props[key], propStyles, JSON.stringify(styles))
    }
  }
}

function deregisterClassName(name: string) {
  // slice 2 to remove specifity
  gc.deregisterClassUse(name.slice(2))
}

// function addDynamicStyles(
//   displayName: string = 'g',
//   prevClassNames: string[] | null,
//   props: GlossThemeProps,
//   themeFns?: ThemeFn[][] | null,
//   avoidStyles?: boolean,
// ) {
//   let dynClassNames: string[] = []

//   if (!avoidStyles && props && themeFns) {
//     for (const themeFnList of themeFns) {
//       const themeStyles = getStylesFromThemeFns(themeFnList, props)
//       if (Object.keys(themeStyles).length) {
//         // make an object for each level of theme
//         const curThemeObj = { ['.']: {} }
//         mergeStyles('.', curThemeObj, themeStyles, false)
//         console.log('applying theme', curThemeObj)
//         const next = addStyles(curThemeObj, displayName, dynClassNames, prevClassNames)
//         if (next) {
//           dynClassNames = [...next, dynClassNames]
//         }
//       }
//     }
//   }

//   // de-register removed classNames
//   if (prevClassNames) {
//     for (const className of prevClassNames) {
//       if (dynClassNames.indexOf(className) === -1) {
//         deregisterClassName(className)
//       }
//     }
//   }

//   return dynClassNames
// }

const isSubStyle = (x: string) => x[0] === '&' || x[0] === '@'

export function mergeStyles(
  id: string,
  styles: { [key: string]: any },
  nextStyles?: CSSPropertySet | null | void,
  overwrite?: boolean,
  rest?: Object
): Object | undefined {
  if (!nextStyles) return
  for (const key in nextStyles) {
    // dont overwrite as we go down
    if (overwrite !== true && styles[id] && styles[id][key] !== undefined) {
      continue
    }
    if (key === 'conditional') {
      styles.conditional = styles.conditional || {}
      styles.conditional = getConditionalStyles(nextStyles[key])
      continue
    }
    if (validCSSAttr[key]) {
      // valid regular attr
      styles[id] = styles[id] || {}
      styles[id][key] = nextStyles[key]
    } else if (isSubStyle(key)) {
      for (const sKey in nextStyles[key]) {
        if (overwrite === true || !styles[key] || styles[key][sKey] === undefined) {
          styles[key] = styles[key] || {}
          styles[key][sKey] = nextStyles[key][sKey]
        }
      }
    } else {
      const pseudoKey = pseudoProps[key]
      if (pseudoKey) {
        // merge in case they defined it two different ways
        styles[pseudoKey] = styles[pseudoKey] || {}
        Object.assign(styles[pseudoKey], nextStyles[key])
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
            styles[mediaSelector] = styles[mediaSelector] || {}
            styles[mediaSelector][styleKey] = nextStyles[key]
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
}

// conditional
//   const Component = gloss({ conditional: { isTall: { height: '100%' } } })
//   usage: <Component isTall />
function getConditionalStyles(conditionalStyles: Object) {
  let propStyles
  for (const pKey in conditionalStyles) {
    const subStyles = conditionalStyles[pKey]
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
  return propStyles
}

function stylesToClassNamesByNS(stylesByNs: any) {
  if (!stylesByNs) return null
  const statics: { [key: string]: ClassNames } = {}
  for (const ns in stylesByNs) {
    const styles = stylesByNs[ns]
    if (ns === 'conditional') {
      for (const condition in styles) {
        const next = stylesToClassNamesByNS(styles[condition])
        if (next) {
          statics[condition] = next
        }
      }
    } else {
      statics[ns] = addRules('', styles, ns, false)
    }
  }
  return statics
}

// happens once at initial gloss() call, so not as perf intense
// get all parent styles and merge them into a big object
// const staticClasses: string[] | null = addStyles(glossProps.styles, depth)
export function getGlossProps(allProps: GlossProps | null, parent: GlossView | null): GlossParsedProps {
  const { config = null, ...glossProp } = allProps || {}
  // all the "glossProp" go onto default props
  let defaultProps: any = getGlossDefaultProps(allProps)

  const styles = {}
  mergeStyles('.', styles, glossProp, true, defaultProps)
  const hasStyles = Object.keys(styles).length
  const staticStyleDesc = hasStyles ? stylesToClassNamesByNS(styles) : null
  const statics = [staticStyleDesc, ...(parent?.internal.glossProps.statics ?? [])]

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
  }
  // merge together the parent chain of static classes
  const curStaticClasses = addStyles(styles) || []
  const parentStaticClasses = parent?.internal?.glossProps.staticClasses || []
  const staticClasses = getUniqueStylesByClassName([...curStaticClasses, ...parentStaticClasses])
  return {
    staticClasses,
    statics,
    config: compileConfig(config, parent),
    styles,
    defaultProps,
    internalDefaultProps,
  }
}

// const styleInfo = {
//   borderLeftRadius: 'bLR-123213123'
// }

// const X = gloss({ background: 'red' })
//   { background: 'bg-1231321' }
// const X2 = gloss(X, { background: 'yellow' })
//   { background: 'bg-1231312' }
// const X3 = gloss(X2).theme(() => ({ background: 'green' }))
//   [{ background: 'green' }]
// const X4 = gloss(X3, { background: 'orange' })
//

/**
 * themes: [[themeCurrent, ...themeHoisted], x, x, x]
 * statics: [{ background: 'bg-123123213' }, undefined, undefined, { background: '12312321' }]
 *
 * const className = getClassNames(props, themes, statics, depth)
 *
 */

type ClassNames = {
  [key: string]: string | ClassNames
}

function getClassNames(props: any, themes: ThemeFn[][], styles: ClassNamesByNs[]): string[] {
  const classNames = {}
  const depth = styles.length
  for (let i = 0; i < depth; i++) {
    const themeStyles = themes[i] && getStylesFromThemeFns(themes[i], props)
    const staticStyles = styles[i]
    console.log('depth', i, props['alpha'], themeStyles, themes[i], staticStyles)
    if (themeStyles) {
      for (const key in themeStyles) {
        mergeStyle(key, themeStyles[key], classNames)
      }
    }
    if (staticStyles) {
      for (const key in staticStyles) {
        mergeStyle(key, staticStyles[key], classNames)
      }
    }
  }
  return Object.values(classNames)
}

function mergeStyle(key: string, val: any, classNames: ClassNames) {
  // check for validity
  if (validCSSAttr[key]) {
    // dont overwrite as we go down in importance
    if (classNames[key]) return
    addRule(key, cssValue(key, val, false, cssOpts), '.', classNames, true, '')
    return
  }
  // will be captured next in isSubStyle
  if (pseudoProps[key]) {
    key = pseudoProps[key]
  }
  if (isSubStyle(key)) {
    classNames[key] = classNames[key] || {}
    console.log('what is', val)
    for (const skey in val[key]) {
      if (classNames[key][skey]) continue
      addRule(skey, cssValue(skey, val[key][skey], false, cssOpts), key, classNames[key] as ClassNames, true, '')
    }
    return
  }
}

const getPrefix = (cn: string) => cn.slice(0, cn.indexOf('-'))

function getUniqueStylesByClassName(classNames: string[]) {
  const res: string[] = []
  const usedPrefix = {}
  for (const cn of classNames) {
    const prefix = getPrefix(cn)
    if (usedPrefix[prefix]) continue
    usedPrefix[prefix] = true
    res.push(cn)
  }
  return res
}

// excludes gloss internal props and leaves style/html props
function getGlossDefaultProps(props: any) {
  const x = {}
  for (const key in props) {
    if (key === 'conditional' || key === 'config') continue
    if (isSubStyle(key)) continue
    x[key] = props[key]
  }
  return x
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
  while (cur?.internal) {
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
export function compileThemes(viewOG: GlossView) {
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

  if (!hasOwnTheme) {
    all.unshift([])
  }

  // hoisted always go onto starting of the cur theme
  if (hoisted.length) {
    all[0] = [
      ...hoisted,
      ...(all[0] || []),
    ]
  }

  const themes = all.filter(Boolean)

  if (!themes.length) {
    return null
  }

  return themes
}

export function getStylesFromThemeFns(themeFns: ThemeFn[], themeProps: Object) {
  let styles: CSSPropertySetLoose = {}
  for (const themeFn of themeFns) {
    const next = themeFn(themeProps as any, styles)
    if (next) {
      styles = styles || {}
      for (const key in next) {
        styles[key] = styles[key] || next[key]
      }
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

// : (A extends true ? string[] : {
//   css: string,
//   className: string
// }) | null
export function addRules<A extends boolean>(
  displayName = '_',
  rules: BaseRules,
  namespace: string,
  insert?: A,
): ClassNames {
  const classNames: ClassNames = {}
  for (let key in rules) {
    if (!cssAttributeAbbreviations[key]) {
      // console.warn('what the key', key)
      continue
    }
    const val = cssValue(key, rules[key], false, cssOpts)
    if (val === undefined) continue
    if (SHORTHANDS[key]) {
      for (let k of SHORTHANDS[key]) {
        addRule(k, val, namespace, classNames, insert, displayName)
      }
    } else {
      addRule(key, val, namespace, classNames, insert, displayName)
    }
  }
  return classNames

  // @ts-ignore
  // return { css, className: finalClassName }
}

function addRule(key: string, val: string, namespace: string, classNames: ClassNames, insert: any, displayName: string) {
  const abbrev = cssAttributeAbbreviations[key]
  key = CAMEL_TO_SNAKE[key] || key
  const isMediaQuery = namespace[0] === '@'
  if (!abbrev) {
    debugger
  }
  const style = `${key}:${val};`
  const className = abbrev + stringHash(`${val}`)
  let selector = `.${className}`
  if (namespace[0] === '&' || namespace.indexOf('&') !== -1) {
    selector = namespace.split(',').map(part => `.${className} ${part.replace('&', '')}`).join(',')
  }
  const css = isMediaQuery ? `${namespace} {${selector} {${style}}}` : `${selector} {${style}}`
  if (className !== undefined) {
    classNames[key] = className
    if (insert === true) {
      // this is the first time we've found this className
      if (!tracker.has(className)) {
        // insert the new style text
        tracker.set(className, {
          displayName,
          namespace,
          selector,
          style,
          className,
        })
        sheet.insert(isMediaQuery ? namespace : selector, css)
      }
    }
  }
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


