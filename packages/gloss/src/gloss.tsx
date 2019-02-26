import { css, CSSPropertySet, ThemeObject, validCSSAttr } from '@mcro/css'
import { isEqual } from '@mcro/fast-compare'
import {
  createElement,
  forwardRef,
  HTMLAttributes,
  memo,
  ReactElement,
  ReactNode,
  useContext,
  useEffect,
  useRef,
  ValidationMap,
} from 'react'
import { validProp } from './helpers/validProp'
import { GarbageCollector } from './stylesheet/gc'
import { hash } from './stylesheet/hash'
import { StyleSheet } from './stylesheet/sheet'
import { ThemeContext } from './theme/ThemeContext'

const GLOSS_SIMPLE_COMPONENT_SYMBOL = '__GLOSS_SIMPLE_COMPONENT__'

export type BaseRules = {
  [key: string]: string | number
}

type GlossProps<Props> = Props & HTMLAttributes<any> & { tagName?: string }
type GlossThemeFn<Props> = ((props: GlossProps<Props>, theme: ThemeObject) => CSSPropertySet | null)

export interface GlossView<Props> {
  // copied from FunctionComponent
  (props: Props & { children?: ReactNode }, context?: any): ReactElement<any> | null
  propTypes?: ValidationMap<Props>
  contextTypes?: ValidationMap<any>
  defaultProps?: Partial<Props>
  displayName?: string
  // extra:
  ignoreAttrs?: Object
  theme: ((cb: GlossThemeFn<Props>) => GlossView<Props>)
  withConfig: (config: { displayName?: string }) => any
  glossConfig: {
    getConfig: () => {
      id: string
      displayName: string
      targetElement: any
      styles: any
      propStyles: Object
      child: any
    }
    themeFn: GlossThemeFn<Props> | null
  }
}

const tracker = new Map()
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
  themeFn: GlossThemeFn<any> | null,
  allStyles: { styles: any; propStyles: any },
  previousClassNames: string[] | null,
  props: CSSPropertySet,
  tagName: string,
  theme: ThemeObject,
) {
  const hasPropStyles = !!Object.keys(allStyles.propStyles).length
  const newStyles = {}

  // if passed any classes from another styled component
  // ignore that class and merge in their resolved styles
  if (props.className) {
    const propClassNames = `${props.className}`.trim().split(whiteSpaceRegex)
    for (const className of propClassNames) {
      const classInfo = tracker.get(className)
      if (classInfo) {
        newStyles[classInfo.namespace] = classInfo.style
      }
    }
  }

  const hasDynamicStyles = themeFn || hasPropStyles
  const dynamicStyles = { [id]: {} }

  if (hasPropStyles) {
    for (const key in allStyles.propStyles) {
      if (props[key] !== true) continue
      for (const styleKey in allStyles.propStyles[key]) {
        const dynKey = styleKey === 'base' ? id : styleKey
        dynamicStyles[dynKey] = {
          ...dynamicStyles[dynKey],
          ...allStyles.propStyles[key][styleKey],
        }
      }
    }
  }

  if (themeFn) {
    addStyles(id, dynamicStyles, themeFn(props, theme))
  }

  if (hasDynamicStyles) {
    for (const key in dynamicStyles) {
      newStyles[key] = dynamicStyles[key]
    }
  }

  let nextClassNames: string[] | null = null

  // sort so we properly order pseudo keys
  const keys = [...new Set([...Object.keys(allStyles.styles), ...Object.keys(newStyles)])]
  const sortedKeys = keys.length > 1 ? keys.sort(pseudoSort) : keys

  // add rules
  for (const key of sortedKeys) {
    let style = allStyles.styles[key]
    if (newStyles[key]) {
      style = { ...style, ...newStyles[key] }
    }
    let x = Date.now()
    const className = addRules(displayName, style, key, tagName)
    if (Date.now() - x > 15) {
      console.warn('long add rules...', displayName, style, tagName, sortedKeys, props, allStyles)
      // debugger
    }
    nextClassNames = nextClassNames || []
    nextClassNames.push(className)
    // if this is the first mount render or we didn't previously have this class then add it as new
    if (previousClassNames == null || !previousClassNames.includes(className)) {
      gc.registerClassUse(className)
    }
  }

  // check what classNames have been removed if this is a secondary render
  if (previousClassNames !== null) {
    for (const className of previousClassNames) {
      // if this previous class isn't in the current classes then deregister it
      if (!nextClassNames || !nextClassNames.includes(className)) {
        gc.deregisterClassUse(className)
      }
    }
  }

  return nextClassNames
}

export function gloss<Props = GlossProps<any>>(
  a?: CSSPropertySet | any,
  b?: CSSPropertySet,
): GlossView<Props> {
  let target = a || 'div'
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

  const isSimpleView = target[GLOSS_SIMPLE_COMPONENT_SYMBOL]
  if (isSimpleView) {
    targetConfig = target.glossConfig.getConfig()
  }

  // shorthand: view({ ... })
  if (typeof target === 'object' && !b && !isSimpleView) {
    target = 'div'
    rawStyles = a
  }

  const targetElement = isSimpleView ? targetConfig.targetElement : target
  const id = `${viewId()}`
  const Styles = getAllStyles(id, target, rawStyles || null)
  let themeFn: GlossThemeFn<any> | null = null

  const ThemedView = (memo(
    forwardRef<HTMLDivElement, GlossProps<Props>>(function Gloss(props, ref) {
      // compile theme on first run to avoid extra work
      themeFn = themeFn || compileTheme(ThemedView)
      const { activeTheme } = useContext(ThemeContext)
      const tag = props.tagName || typeof targetElement === 'string' ? targetElement : ''
      const lastClassNames = useRef<string[] | null>(null)
      const classNames = glossify(
        id,
        ThemedView.displayName,
        themeFn,
        Styles,
        lastClassNames.current,
        props,
        tag,
        activeTheme,
      )
      lastClassNames.current = classNames

      // unmount
      useEffect(() => {
        return () => {
          const names = lastClassNames.current
          if (names) {
            names.forEach(gc.deregisterClassUse)
          }
        }
      }, [])

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
    }),
    isEqual,
  ) as unknown) as GlossView<Props>

  ThemedView.glossConfig = {
    themeFn: null,
    getConfig: () => ({
      id,
      displayName: ThemedView.displayName || '',
      targetElement,
      ignoreAttrs,
      styles: { ...Styles.styles },
      propStyles: { ...Styles.propStyles },
      child: isSimpleView ? target : null,
    }),
  }
  ThemedView[GLOSS_SIMPLE_COMPONENT_SYMBOL] = true
  ThemedView.withConfig = config => {
    if (config.displayName) {
      ThemedView.displayName = config.displayName
    }
    return ThemedView
  }
  ThemedView.theme = themeFn => {
    ThemedView.glossConfig.themeFn = themeFn
    return ThemedView
  }

  return ThemedView
}

// ensures &:active psuedo selectors are always placed below
// so they override &:hover and &:hover
// TODO: make sure &:active:hover is below below
// TODO: and make sure &:focus:hover is below below
const pseudoSort = (a: string) => (a[0] === '@' || a.indexOf('&:active') === 0 ? 1 : -1)

const arrToDict = (obj: Object) => {
  if (Array.isArray(obj)) {
    return obj.reduce((acc, cur) => {
      acc[cur] = true
      return acc
    }, {})
  }
  return obj
}

const addStyles = (id: string, baseStyles: Object, nextStyles: CSSPropertySet | null) => {
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

// gets childrens styles and merges them into a big object
const getAllStyles = (baseId: string, target: any, rawStyles: CSSPropertySet | null) => {
  const styles = {
    [baseId]: {},
  }
  const propStyles = addStyles(baseId, styles, rawStyles)
  // merge child styles
  if (target[GLOSS_SIMPLE_COMPONENT_SYMBOL]) {
    const childConfig = target.glossConfig.getConfig()
    const childPropStyles = childConfig.propStyles
    if (childPropStyles) {
      for (const key in childPropStyles) {
        propStyles[key] = propStyles[key] || {}
        propStyles[key] = {
          ...childPropStyles[key],
          ...propStyles[key],
        }
      }
    }
    const childStyles = childConfig.styles
    const childId = childConfig.id
    const moveToMyId = childStyles[childId]
    delete childStyles[childId]
    childStyles[baseId] = moveToMyId
    for (const key in childStyles) {
      styles[key] = {
        ...childStyles[key],
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

// compiled theme from ancestors
function compileTheme(ogView: GlossView<any>) {
  let view = ogView
  let themes: GlossThemeFn<any>[] = []
  // collect the themes going up the tree
  while (view) {
    if (view.glossConfig.themeFn) {
      themes.push(view.glossConfig.themeFn)
    }
    view = view.glossConfig.getConfig().child
  }
  let result
  if (!themes.length) {
    result = null
  } else {
    result = (props: Object, theme: ThemeObject) => {
      let styles = {}
      // from most important to least
      for (const themeFn of themes) {
        styles = {
          ...themeFn(props, theme),
          ...styles,
        }
      }
      return styles
    }
  }
  return result
}
