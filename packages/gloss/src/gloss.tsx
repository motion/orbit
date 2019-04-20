import { css, CSSPropertySet, CSSPropertySetResolved, ThemeObject, validCSSAttr } from '@o/css'
import { isEqual } from '@o/fast-compare'
import { flatten } from 'lodash'
import { createElement, forwardRef, memo, useContext, useEffect, useRef } from 'react'

import { Config } from './config'
import { validProp } from './helpers/validProp'
import { GarbageCollector, StyleTracker } from './stylesheet/gc'
import { hash } from './stylesheet/hash'
import { StyleSheet } from './stylesheet/sheet'
import { ThemeContext } from './theme/ThemeContext'

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

function addRules(displayName: string, rules: BaseRules, namespace: string, tagName: string) {
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

const whiteSpaceRegex = /[\s]+/g

function glossify(
  id: string,
  displayName: string = 'g',
  themeFn: ThemeFn | null,
  staticStyles: any,
  conditionalStyles: any,
  prevClassNames: string[] | null,
  props: CSSPropertySet,
  tagName: string,
  theme: ThemeObject,
) {
  const hasConditionalStyles = !!Object.keys(conditionalStyles).length
  const dynStyles = {}

  // if passed any classes from another styled component
  // ignore that class and merge in their resolved styles
  if (props.className) {
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
      if (props[key] !== true) continue
      for (const styleKey in conditionalStyles[key]) {
        const dynKey = styleKey === 'base' ? id : styleKey
        dynamicStyles[dynKey] = dynamicStyles[dynKey] || {}
        Object.assign(dynamicStyles[dynKey], conditionalStyles[key][styleKey])
      }
    }
  }

  if (themeFn) {
    const next = Config.preProcessTheme ? Config.preProcessTheme(props, theme) : theme
    addStyles(id, dynamicStyles, themeFn(props, next))
  }

  if (hasDynamicStyles) {
    for (const key in dynamicStyles) {
      dynStyles[key] = dynamicStyles[key]
    }
  }

  let classNames: string[] | null = null

  // sort so we properly order pseudo keys
  const keys = [...new Set([...Object.keys(staticStyles), ...Object.keys(dynStyles)])]
  const sortedKeys = keys.length > 1 ? keys.sort(pseudoSort) : keys

  // we'll return the final (non-psuedo/child) styles
  let styles: CSSPropertySet | null = null

  // add rules
  for (const key of sortedKeys) {
    // take base styles
    let cur = staticStyles[key]

    // add on the dynamic overrides
    if (dynStyles[key]) {
      cur = { ...cur, ...dynStyles[key] }
    }

    // return the final result of the style object
    if (key === id) {
      styles = cur
    }

    // they may return falsy, conditional '&:hover': active ? hoverStyle : null
    if (!cur) {
      continue
    }

    // add the stylesheets and classNames
    // TODO this could do a simple "diff" so that fast-changing styles only change the "changing" props
    // it would likely help things like when you animate based on mousemove, may be slower in default case
    const className = addRules(displayName, cur, key, tagName)
    classNames = classNames || []
    classNames.push(className)

    // if this is the first mount render or we didn't previously have this class then add it as new
    if (prevClassNames == null || !prevClassNames.includes(className)) {
      gc.registerClassUse(className)
    }
  }

  // check what classNames have been removed if this is a secondary render
  if (prevClassNames !== null) {
    for (const className of prevClassNames) {
      // if this previous class isn't in the current classes then deregister it
      if (!classNames || !classNames.includes(className)) {
        gc.deregisterClassUse(className)
      }
    }
  }

  return { classNames, styles }
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

// const x = gloss<{ isActive?: boolean }>()
// const y = gloss<{ otherProp?: boolean }>(x)

// type InferProps<A> = A extends GlossView<infer B> ? B : never

// type test = InferProps<typeof x>

// type JoinViews<Props extends any = any, Parent extends any = any> = Props & InferProps<Parent>

// function join<Props = any, A = any>(a?: A): A extends GlossView<infer B> ? B : Props { return a as any }

// const yz = join<{ ok?: number }>(y)

// type Z = JoinViews<{ otherProp?: boolean }, typeof x>

// export function gloss<Props = any>(a?: undefined): GlossView<Props>
// export function gloss<Props = any, Parent extends any = any>(
//   a: Parent,
// ): Parent extends GlossView<infer P> ? GlossView<Props & P> : GlossView<Props>
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
  const id = `${viewId()}`
  const Styles = getAllStyles(id, target, rawStyles || null)
  let themeFn: ThemeFn | null = null

  let ThemedView = (forwardRef<HTMLDivElement, GlossProps<Props>>(function Gloss(props, ref) {
    // compile theme on first run to avoid extra work
    themeFn = themeFn || compileTheme(ThemedView)
    const { activeTheme } = useContext(ThemeContext)
    const tag = props.tagName || typeof targetElement === 'string' ? targetElement : ''
    const curClassNames = useRef<string[] | null>(null)

    // unmount
    useEffect(() => {
      return () => {
        const names = curClassNames.current
        if (names) {
          names.forEach(gc.deregisterClassUse)
        }
      }
    }, [])

    const { classNames, styles } = glossify(
      id,
      ThemedView.displayName,
      themeFn,
      Styles.styles,
      Styles.propStyles,
      curClassNames.current,
      props,
      tag,
      activeTheme,
    )
    curClassNames.current = classNames

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
      // dont pass down things we used for styles
      // this could be confusing / configurable
      if (styles && styles.hasOwnProperty(key)) {
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
  }) as unknown) as GlossView<Props>

  ThemedView = (memo(ThemedView, isEqual) as unknown) as GlossView<Props>

  ThemedView.config = {
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
  ThemedView[GLOSS_SIMPLE_COMPONENT_SYMBOL] = true
  ThemedView.withConfig = config => {
    if (config.displayName) {
      ThemedView.displayName = config.displayName
    }
    return ThemedView
  }
  ThemedView.theme = (...themeFns) => {
    ThemedView.config.themeFns = themeFns
    return ThemedView
  }

  return ThemedView
}

// keeps priority of hover/active/focus as expected
const psuedoScore = (x: string) => {
  const hasFocus = x.indexOf('&:active') > 0 ? 1 : 0
  const hasActive = x.indexOf('&:active') > 0 ? 3 : 0
  const hasHover = x.indexOf('&:hover') > 0 ? 2 : 0
  return hasActive + hasHover + hasFocus
}
const pseudoSort = (a: string, b: string) => (psuedoScore(a) > psuedoScore(b) ? -1 : 1)

const arrToDict = (obj: Object) => {
  if (Array.isArray(obj)) {
    return obj.reduce((acc, cur) => {
      acc[cur] = true
      return acc
    }, {})
  }
  return obj
}

const addStyles = (id: string, baseStyles: Object, nextStyles?: CSSPropertySet | null) => {
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
const getAllStyles = (baseId: string, target: any, rawStyles: CSSPropertySet | null) => {
  const styles = {
    [baseId]: {},
  }
  const propStyles = addStyles(baseId, styles, rawStyles)
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
