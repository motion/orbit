import {
  CSSPropertySet,
  CSSPropertySetResolved,
  cssString,
  styleToClassName,
  ThemeObject,
  validCSSAttr,
} from '@o/css'
import { createElement, forwardRef, isValidElement, memo, useEffect, useRef } from 'react'

import { Config } from './config'
import { useTheme } from './helpers/useTheme'
import { validProp } from './helpers/validProp'
import { GarbageCollector, StyleTracker } from './stylesheet/gc'
import { StyleSheet } from './stylesheet/sheet'

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
  ref?: any
  style?: any
  alt?: string
}

export type ThemeFn<Props = any> = (
  props: GlossProps<Props>,
  theme: ThemeObject,
  previous?: CSSPropertySetResolved | null,
) => CSSPropertySetResolved | null | undefined

export type GlossViewOptions<Props> = {
  displayName?: string
  ignoreAttrs?: { [key: string]: boolean }
  defaultProps?: Partial<Props>
}

type GlossInternalConfig = {
  id: string
  displayName: string
  targetElement: any
  styles: any
  conditionalStyles: Object
  parent: any
}

type GlossInternals<Props> = {
  themeFns: ThemeFn<Props>[] | null
  getConfig: () => GlossInternalConfig
}

export interface GlossView<RawProps, Props = GlossProps<RawProps>> {
  // copied from FunctionComponent
  (props: GlossProps<Props>, context?: any): React.ReactElement<any> | null
  propTypes?: React.ValidationMap<Props>
  contextTypes?: React.ValidationMap<any>
  defaultProps?: Partial<Props>
  displayName?: string
  // extra:
  ignoreAttrs?: { [key: string]: boolean }
  theme: (...themeFns: ThemeFn<Props>[]) => GlossView<Props>
  withConfig: (config: GlossViewOptions<Props>) => GlossView<Props>
  internal: GlossInternals<Props>
}

const GLOSS_SIMPLE_COMPONENT_SYMBOL = '__GLOSS_SIMPLE_COMPONENT__'
const tracker: StyleTracker = new Map()
const rulesToClass = new WeakMap()
const sheet = new StyleSheet(true)
const gc = new GarbageCollector(sheet, tracker, rulesToClass)
const whiteSpaceRegex = /[\s]+/g

let idCounter = 1
const viewId = () => idCounter++ % Number.MAX_SAFE_INTEGER

export function gloss<Props = any>(
  a?: CSSPropertySet | GlossView<Props> | ((props: Props) => any) | string,
  b?: CSSPropertySet,
): GlossView<GlossProps<Props>> {
  let target: any = a || 'div'
  let rawStyles = b
  let ignoreAttrs: Object
  const hasGlossyChild = target[GLOSS_SIMPLE_COMPONENT_SYMBOL]
  const targetConfig: GlossInternalConfig = hasGlossyChild ? target.internal.getConfig() : null

  setTimeout(() => {
    if (!ignoreAttrs) {
      ignoreAttrs =
        ThemedView.ignoreAttrs || (hasGlossyChild && target.ignoreAttrs) || baseIgnoreAttrs
    }
  }, 0)

  // shorthand: gloss({ ... })
  if (
    typeof a !== 'string' &&
    target.constructor &&
    target.constructor.name === 'Object' &&
    !b &&
    !hasGlossyChild &&
    !isValidElement(target) &&
    // if you pass an element wrapped in forwardRef() it needs to be filtered somehow..
    !target['$$typeof']
  ) {
    target = 'div'
    rawStyles = a
  }

  const targetElement = hasGlossyChild ? targetConfig.targetElement : target
  const targetElementName = typeof targetElement === 'string' ? targetElement : ''
  const id = `${viewId()}`
  const Styles = getAllStyles(id, target, rawStyles || null)

  const conditionalStyles = Styles.conditionalStyles
  let themeFn: ThemeFn | null = null
  let staticClasses: string[] | null = null

  function GlossView(props: GlossProps<Props>, ref: any) {
    // compile theme on first run to avoid extra work
    themeFn = themeFn || compileTheme(ThemedView)

    // compile static styles once, on first run to avoid extra work
    staticClasses =
      staticClasses || addStyles(Styles.styles, ThemedView.displayName, targetElementName)

    const theme = useTheme()
    const dynClasses = useRef<string[] | null>(null)

    // unmount
    useEffect(() => {
      return () => {
        const x = dynClasses.current
        if (x) x.forEach(gc.deregisterClassUse)
      }
    }, [])

    const dynClassNames = addDynamicStyles(
      id,
      ThemedView.displayName,
      conditionalStyles,
      dynClasses.current,
      props,
      themeFn,
      theme,
      targetElementName,
    )

    const classNames = staticClasses
      ? dynClassNames
        ? [...staticClasses, ...dynClassNames]
        : staticClasses
      : dynClassNames

    if (props['debug']) {
      window['tracker'] = tracker
    }

    dynClasses.current = dynClassNames

    // if this is a plain view we can use tagName, otherwise just pass it down
    const element =
      typeof targetElement === 'string' ? props.tagName || targetElement : targetElement
    const isDOMElement = typeof element === 'string'

    // set up final props with filtering for various attributes
    let finalProps: any = {
      className: props.className || '',
      'data-is': ThemedView.displayName,
    }

    if (ref) {
      finalProps.ref = ref
    }

    if (isDOMElement) {
      for (const key in props) {
        if (ignoreAttrs && ignoreAttrs[key]) {
          continue
        }
        if (conditionalStyles && conditionalStyles[key]) {
          continue
        }
        // TODO: need to figure out this use case: when a valid prop attr, but invalid val
        if (key === 'size' && typeof props[key] !== 'string') {
          continue
        }
        if (isDOMElement) {
          if (validProp(key)) {
            finalProps[key] = props[key]
          }
        } else {
          finalProps[key] = props[key]
        }
      }
    } else {
      for (const key in props) {
        if (conditionalStyles && conditionalStyles[key]) {
          continue
        }
        finalProps[key] = props[key]
      }
    }

    if (classNames) {
      finalProps.className += ` ${classNames.join(' ')}`
    }

    return createElement(element, finalProps, props.children)
  }

  const internal: GlossInternals<Props> = {
    themeFns: null,
    getConfig: () => ({
      id,
      displayName: ThemedView.displayName || '',
      targetElement,
      styles: { ...Styles.styles },
      conditionalStyles: { ...Styles.conditionalStyles },
      parent: hasGlossyChild ? target : null,
    }),
  }

  let ThemedView = createGlossView<Props>(GlossView, internal)

  // inherit default props
  if (hasGlossyChild) {
    ThemedView.defaultProps = target.defaultProps
  }

  ThemedView.withConfig = opts => {
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

  return ThemedView
}

function createGlossView<Props>(GlossView: any, config) {
  const forwarded = forwardRef<HTMLDivElement, GlossProps<Props>>(GlossView)
  const res: GlossView<Props> = memo(forwarded) as any
  res.internal = config
  res[GLOSS_SIMPLE_COMPONENT_SYMBOL] = true
  res.theme = (...themeFns) => {
    config.themeFns = themeFns
    return res
  }
  return res
}

// keeps priority of hover/active/focus as expected
const psuedoScore = (x: string) => {
  const hasFocus = x.indexOf('&:focus') > -1 ? 1 : 0
  const hasHover = x.indexOf('&:hover') > -1 ? 2 : 0
  const hasActive = x.indexOf('&:active') > -1 ? 3 : 0
  return hasActive + hasHover + hasFocus
}

const pseudoSort = (a: string, b: string) => (psuedoScore(a) > psuedoScore(b) ? 1 : -1)

// takes a style object, adds it to stylesheet, returns classnames
function addStyles(
  styles: any,
  displayName?: string,
  tagName?: string,
  prevClassNames?: string[] | null,
) {
  const keys = Object.keys(styles).sort(pseudoSort)
  let classNames: string[] | null = null
  for (const key of keys) {
    const rules = styles[key]
    // they may return falsy, conditional '&:hover': active ? hoverStyle : null
    if (!rules) continue

    // add the stylesheets and classNames
    // TODO this could do a simple "diff" so that fast-changing styles only change the "changing" props
    // it would likely help things like when you animate based on mousemove, may be slower in default case
    const className = addRules(displayName, rules, key, tagName)
    classNames = classNames || []
    classNames.push(className)

    // if this is the first mount render or we didn't previously have this class then add it as new
    if (!prevClassNames || !prevClassNames.includes(className)) {
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

function addDynamicStyles(
  id: string,
  displayName: string = 'g',
  conditionalStyles: Object | undefined,
  prevClassNames: string[] | null,
  props: CSSPropertySet,
  themeFn?: ThemeFn | null,
  theme?: ThemeObject,
  tagName?: string,
) {
  const dynStyles = {}
  let classNames: string[] = []

  // applies styles most important to least important
  // that saves us some processing time (no need to set multiple times)
  // note that means the topmost `mergeStyles` will apply as most important

  // if passed any classes from a parent gloss view, merge them, ignore classname and track
  if (props.className) {
    const propClassNames = props.className.trim().split(whiteSpaceRegex)
    // note this reverse: this is a bit odd
    // right now we have conditionalStyles applied as their own className (so base: .1, conditional: .2)
    // then we pass className="1 2" if we have a parent that the conditional style === true
    // what we probably want is to merge them all into their own single className
    // until then, we need to preserve the important order, so we reverse to make sure conditional applies first
    propClassNames.reverse()
    for (const className of propClassNames) {
      const info = tracker.get(className)
      if (info) {
        dynStyles[id] = dynStyles[id] || {}
        mergeStyles(id, dynStyles, info.rules)
        gc.registerClassUse(info.className)
      } else {
        classNames.push(className)
      }
    }
  }

  if (conditionalStyles) {
    mergePropStyles(id, dynStyles, conditionalStyles, props)
  }

  if (theme && themeFn) {
    const next = Config.preProcessTheme ? Config.preProcessTheme(props, theme) : theme
    dynStyles[id] = dynStyles[id] || {}
    const themePropStyles = mergeStyles(id, dynStyles, themeFn(props, next), true)
    if (themePropStyles) {
      mergePropStyles(id, dynStyles, themePropStyles, props)
    }
  }

  // add dyn styles
  const dynClassNames = addStyles(dynStyles, displayName, tagName, prevClassNames)
  if (dynClassNames) {
    classNames = [...classNames, ...dynClassNames]
  }

  // check what classNames have been removed if this is a secondary render
  if (prevClassNames) {
    for (const className of prevClassNames) {
      // if this previous class isn't in the current classes then deregister it
      if (!classNames.includes(className)) {
        gc.deregisterClassUse(className)
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
//
function mergeStyles(
  id: string,
  baseStyles: Object,
  nextStyles?: CSSPropertySet | null,
  overwrite?: boolean,
): Object | undefined {
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
      // valid sub-attribute
      baseStyles[key] = nextStyles[key]
    } else {
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
  return propStyles
}

// happens once at initial gloss() call, so not as perf intense
// get all parent styles and merge them into a big object
function getAllStyles(baseId: string, target: any, rawStyles: CSSPropertySet | null) {
  const styles = {
    [baseId]: {},
  }
  let conditionalStyles = mergeStyles(baseId, styles, rawStyles)
  // merge parent styles
  if (target[GLOSS_SIMPLE_COMPONENT_SYMBOL]) {
    const parentConfig: GlossInternalConfig = target.internal.getConfig()
    const parentPropStyles = parentConfig.conditionalStyles
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
    const parentStyles = parentConfig.styles
    const parentId = parentConfig.id
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
    cur = conf.getConfig().parent
  }

  // reverse, then flatten, so its a flat list of themes from least to most important
  // makes it easier to apply them in order
  all.reverse()
  const themes = all.flat().filter(Boolean)

  if (!themes.length) {
    return null
  }

  return (props: Object, theme: ThemeObject) => {
    let styles: CSSPropertySetResolved | null = null
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
function addRules(displayName = '_', rules: BaseRules, namespace: string, tagName?: string) {
  // if these rules have been cached to a className then retrieve it
  const cachedClass = rulesToClass.get(rules)
  if (cachedClass) {
    return cachedClass
  }

  const style = cssString(rules)

  // build the class name with the display name of the styled component and a unique id based on the css and namespace
  const className = styleToClassName(style)

  // this is the first time we've found this className
  if (!tracker.has(className)) {
    // build up the correct selector, explode on commas to allow multiple selectors
    const selector = getSelector(className, namespace, tagName)
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
      sheet.insert(namespace, `${namespace} {\n${selector} {\n${style}\n}\n}`)
    } else {
      sheet.insert(className, `${selector} {\n${style}\n}`)
    }

    rulesToClass.set(rules, className)
  }

  return className
}
// has to return a .specific-id and .id selector for use in parents passing down styles
function getSelector(className: string, namespace: string, tagName: string = '') {
  if (namespace[0] === '@') {
    return `${tagName}.${className}, ${tagName}.specific-${className}`
  }
  if (namespace.indexOf('&') !== -1) {
    // namespace === '&:hover, &:focus, & > div'
    const namespacedSelectors = namespace
      .split(',')
      .flatMap(part => {
        const selector = part.replace('&', className).trim()
        return [`.specific-${selector}`, `.${selector}`]
      })
      .join(',')
    return namespacedSelectors
  }
  return `.specific-${className}, .${className}`
}
