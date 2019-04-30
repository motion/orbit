import { css, CSSPropertySet, CSSPropertySetResolved, ThemeObject, validCSSAttr } from '@o/css'
import { isEqual } from '@o/fast-compare'
import { flatten } from 'lodash'
import { createElement, forwardRef, memo, useEffect, useRef } from 'react'

import { Config } from './config'
import { useTheme } from './helpers/useTheme'
import { validProp } from './helpers/validProp'
import { GarbageCollector, StyleTracker } from './stylesheet/gc'
import { hash } from './stylesheet/hash'
import { StyleSheet } from './stylesheet/sheet'

const GLOSS_SIMPLE_COMPONENT_SYMBOL = '__GLOSS_SIMPLE_COMPONENT__'

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

const tracker: StyleTracker = new Map()
const rulesToClass = new WeakMap()
const sheet = new StyleSheet(true)
const gc = new GarbageCollector(sheet, tracker, rulesToClass)

let idCounter = 1
const viewId = () => idCounter++ % Number.MAX_SAFE_INTEGER

const whiteSpaceRegex = /[\s]+/g

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
    const cur = styles[key]
    // they may return falsy, conditional '&:hover': active ? hoverStyle : null
    if (!cur) continue

    // add the stylesheets and classNames
    // TODO this could do a simple "diff" so that fast-changing styles only change the "changing" props
    // it would likely help things like when you animate based on mousemove, may be slower in default case
    const className = addRules(displayName, cur, key, tagName)
    classNames = classNames || []
    classNames.push(className)

    // if this is the first mount render or we didn't previously have this class then add it as new
    if (!prevClassNames || !prevClassNames.includes(className)) {
      gc.registerClassUse(className)
    }
  }
  return classNames
}

function glossify(
  id: string,
  displayName: string = 'g',
  conditionalStyles?: any,
  prevClassNames?: string[] | null,
  props?: CSSPropertySet,
  themeFn?: ThemeFn | null,
  theme?: ThemeObject,
  tagName?: string,
) {
  const hasConditionalStyles = conditionalStyles && !!Object.keys(conditionalStyles).length
  const dynStyles = {}

  // if passed any classes from another styled component
  // ignore that class and merge in their resolved styles
  if (props && props.className) {
    const propClassNames = `${props.className}`.trim().split(whiteSpaceRegex)
    for (const className of propClassNames) {
      const classInfo = tracker.get(className)
      if (classInfo) {
        dynStyles[classInfo.namespace] = classInfo.style
      }
    }
  }

  const hasDynamicStyles = !!(themeFn || hasConditionalStyles)
  const dynamicStyles = { [id]: {} }

  if (hasConditionalStyles) {
    for (const key in conditionalStyles) {
      if (props && props[key] !== true) continue
      for (const styleKey in conditionalStyles[key]) {
        const dynKey = styleKey === 'base' ? id : styleKey
        dynamicStyles[dynKey] = dynamicStyles[dynKey] || {}
        Object.assign(dynamicStyles[dynKey], conditionalStyles[key][styleKey])
      }
    }
  }

  if (theme && themeFn) {
    const next = Config.preProcessTheme ? Config.preProcessTheme(props, theme) : theme
    mergeStyles(id, dynamicStyles, themeFn(props, next))
  }

  if (hasDynamicStyles) {
    for (const key in dynamicStyles) {
      dynStyles[key] = dynamicStyles[key]
    }
  }

  let classNames: string[] | null = []

  // add dyn styles
  const dynamics = addStyles(dynStyles, displayName, tagName, prevClassNames)
  if (dynamics) classNames = [...classNames, ...dynamics]

  // check what classNames have been removed if this is a secondary render
  if (prevClassNames) {
    for (const className of prevClassNames) {
      // if this previous class isn't in the current classes then deregister it
      if (!classNames || !classNames.includes(className)) {
        gc.deregisterClassUse(className)
      }
    }
  }

  return classNames
}

export interface GlossView<Props> {
  // copied from FunctionComponent
  (props: GlossProps<Props>, context?: any): React.ReactElement<any> | null
  propTypes?: React.ValidationMap<Props>
  contextTypes?: React.ValidationMap<any>
  defaultProps?: Partial<Props>
  displayName?: string
  // extra:
  ignoreAttrs?: Object
  theme: (...themeFns: ThemeFn<Props>[]) => GlossView<Props>
  withConfig: (config: { displayName?: string }) => any
  config: {
    getConfig: () => {
      id: string
      displayName: string
      targetElement: any
      styles: any
      propStyles: Object
      parent: any
    }
    themeFns: ThemeFn<Props>[] | null
  }
}

function createGlossView<Props>(GlossView: any, config) {
  const forwarded = forwardRef<HTMLDivElement, GlossProps<Props>>(GlossView)
  const res: GlossView<Props> = memo(forwarded, isEqual) as any
  res.config = config
  res[GLOSS_SIMPLE_COMPONENT_SYMBOL] = true
  res.theme = (...themeFns) => {
    config.themeFns = themeFns
    return res
  }
  return res
}

export function gloss<Props = any>(
  a?: CSSPropertySet | GlossView<Props> | ((props: Props) => any) | string,
  b?: CSSPropertySet,
): GlossView<GlossProps<Props>> {
  let target: any = a || 'div'
  let rawStyles = b
  let targetConfig
  let ignoreAttrs: Object

  // TODO this can be done on first render to lazy load
  // update ignore attributes
  setTimeout(() => {
    const targetAttrs = targetConfig ? targetConfig.ignoreAttrs : null
    const attrArr = ThemedView.ignoreAttrs || targetAttrs
    ignoreAttrs = arrToDict(attrArr)
  }, 0)

  const isGlossParent = target[GLOSS_SIMPLE_COMPONENT_SYMBOL]
  if (isGlossParent) {
    targetConfig = target.config.getConfig()
  }

  // shorthand: view({ ... })
  if (typeof a !== 'string' && typeof target === 'object' && !b && !isGlossParent) {
    target = 'div'
    rawStyles = a
  }

  const targetElement = isGlossParent ? targetConfig.targetElement : target
  const targetElementName = typeof targetElement === 'string' ? targetElement : ''
  const id = `${viewId()}`
  const Styles = getAllStyles(id, target, rawStyles || null)
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
        const names = dynClasses.current
        if (names) {
          names.forEach(gc.deregisterClassUse)
        }
      }
    }, [])

    const dynClassNames = glossify(
      id,
      ThemedView.displayName,
      Styles.propStyles,
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
    dynClasses.current = dynClassNames

    // if this is a plain view we can use tagName, otherwise just pass it down
    const element =
      typeof targetElement === 'string' ? props.tagName || targetElement : targetElement
    const isDOMElement = typeof element === 'string'

    // set up final props with filtering for various attributes
    const finalProps = {
      className: props.className || '',
    } as any

    if (ref) {
      finalProps.ref = ref
    }

    for (const key in props) {
      if (ignoreAttrs && ignoreAttrs[key]) {
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

    if (classNames) {
      finalProps.className += ` ${classNames.join(' ')}`
    }

    return createElement(element, finalProps, props.children)
  }

  const config = {
    themeFns: null,
    getConfig: () => ({
      id,
      displayName: ThemedView.displayName || '',
      targetElement,
      ignoreAttrs,
      styles: { ...Styles.styles },
      propStyles: { ...Styles.propStyles },
      parent: isGlossParent ? target : null,
    }),
  }

  let ThemedView = createGlossView<Props>(GlossView, config)

  // inherit default props
  if (isGlossParent) {
    ThemedView.defaultProps = target.defaultProps
  }

  ThemedView.withConfig = ({ displayName }) => {
    // re-create it so it picks up displayName
    if (displayName) {
      GlossView['displayName'] = displayName
      ThemedView = createGlossView<Props>(GlossView, config)
      ThemedView['displayName'] = displayName
    }
    return ThemedView
  }

  return ThemedView
}

// keeps priority of hover/active/focus as expected
const psuedoScore = (x: string) => {
  const hasFocus = x.indexOf('&:focus') > -1 ? 1 : 0
  const hasHover = x.indexOf('&:hover') > -1 ? 2 : 0
  const hasActive = x.indexOf('&:active') > -1 ? 3 : 0
  return hasActive + hasHover + hasFocus
}
const pseudoSort = (a: string, b: string) => (psuedoScore(a) > psuedoScore(b) ? 1 : -1)

const arrToDict = (obj: Object) => {
  if (Array.isArray(obj)) {
    return obj.reduce((acc, cur) => {
      acc[cur] = true
      return acc
    }, {})
  }
  return obj
}

function mergeStyles(id: string, baseStyles: Object, nextStyles?: CSSPropertySet | null) {
  const propStyles = {}
  for (const key in nextStyles) {
    // dont overwrite as we go down
    if (!baseStyles[id]) {
      console.error('no baseStyles for id', id, baseStyles, 'nextStyles', nextStyles)
      continue
    }
    if (typeof baseStyles[id][key] !== 'undefined') {
      continue
    }
    // valid attribute
    if (key[0] === '&' || key[0] === '@') {
      baseStyles[key] = nextStyles[key]
    } else if (validCSSAttr[key]) {
      baseStyles[id][key] = nextStyles[key]
    } else {
      // were defining a boolean prop style
      //   looks like: <Component tall />
      //   via: view({ color: 'red', tall: { height: '100%' } })
      const prop = key
      const styleObj = nextStyles[key]
      if (typeof styleObj === 'object') {
        propStyles[prop] = {
          base: {},
        }
        for (const subKey in styleObj) {
          if (subKey[0] === '&' || subKey[0] === '@') {
            propStyles[prop][subKey] = styleObj[subKey]
          } else {
            propStyles[prop].base[subKey] = styleObj[subKey]
          }
        }
      }
    }
  }
  return propStyles
}

// gets parentrens styles and merges them into a big object
function getAllStyles(baseId: string, target: any, rawStyles: CSSPropertySet | null) {
  const styles = {
    [baseId]: {},
  }
  const propStyles = mergeStyles(baseId, styles, rawStyles)
  // merge parent styles
  if (target[GLOSS_SIMPLE_COMPONENT_SYMBOL]) {
    const parentConfig = target.config.getConfig()
    const parentPropStyles = parentConfig.propStyles
    if (parentPropStyles) {
      for (const key in parentPropStyles) {
        propStyles[key] = propStyles[key] || {}
        propStyles[key] = {
          ...parentPropStyles[key],
          ...propStyles[key],
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
    propStyles,
  }
}

function getSelector(className: string, namespace: string, tagName: string = '') {
  if (namespace[0] === '@') {
    return tagName + '.' + className
  }
  const classSelect = `.${className}`
  if (namespace.indexOf('&') !== -1) {
    return namespace.replace(/&/g, classSelect)
  }
  return classSelect
}

// compile theme from parents
function compileTheme(viewOG: GlossView<any>) {
  let cur = viewOG
  let all: ThemeFn[][] = []

  // get themes in order from most important (current) to least important (grandparent)
  while (cur) {
    const conf = cur.config
    if (conf.themeFns) {
      all.push(conf.themeFns)
    }
    cur = conf.getConfig().parent
  }

  // then flatten and reverse, so its a flat list of themes from least to most important
  // makes it easier to apply them in order
  const themes = flatten(all.reverse()).filter(Boolean)

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
  const declarations: string[] = []
  const style = css(rules)
  // generate css declarations based on the style object
  for (const key in style) {
    const val = style[key]
    declarations.push(`  ${key}: ${val};`)
  }
  const cssString = declarations.join('\n')
  // build the class name with the display name of the styled component and a unique id based on the css and namespace
  const className = displayName + '__' + hash(namespace + cssString)
  // for media queries
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
    })
    if (namespace[0] === '@') {
      sheet.insert(namespace, `${namespace} {\n${selector} {\n${cssString}\n}\n}`)
    } else {
      sheet.insert(className, `${selector} {\n${cssString}\n}`)
    }
    rulesToClass.set(rules, className)
  }
  return className
}
