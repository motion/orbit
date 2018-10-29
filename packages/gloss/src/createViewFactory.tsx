import * as React from 'react'
import { ThemeContext } from './theme/ThemeContext'
import { CSSPropertySet, validCSSAttr, ThemeObject } from '@mcro/css'
import { GarbageCollector } from './stylesheet/gc'
import hash from './stylesheet/hash'
import { StyleSheet } from './stylesheet/sheet'
import { GLOSS_SIMPLE_COMPONENT_SYMBOL } from './symbols'
import validProp from './helpers/validProp'

export type RawRules = CSSPropertySet & {
  [key: string]: CSSPropertySet
}
export type BaseRules = {
  [key: string]: string | number
}

type SimpleViewProps = React.HTMLProps<any> & CSSPropertySet & { theme?: ThemeObject }

export type SimpleView = React.SFC<SimpleViewProps> & {
  theme: ((a: SimpleViewProps & { theme: ThemeObject }) => CSSPropertySet)
}

// const isHMREnabled =
//   process.env.NODE_ENV === 'development' && typeof module !== 'undefined' && !!module['hot']

// const recentHMR = () => {
//   const lastHMR = +window['__lastHMR']
//   return Date.now() - lastHMR < 400
// }

// ensures &:active psuedo selectors are always placed below
// so they override &:hover and &:hover
// TODO: make sure &:active:hover is below below
// TODO: and make sure &:focus:hover is below below
const pseudoSort = a => (a[0] === '@' || a.indexOf('&:active') === 0 ? 1 : -1)

const arrToDict = obj => {
  if (Array.isArray(obj)) {
    return obj.reduce((acc, cur) => {
      acc[cur] = true
      return acc
    }, {})
  }
  return obj
}

// import sonar

const addStyles = (id, baseStyles, nextStyles) => {
  const propStyles = {}
  for (const key in nextStyles) {
    // dont overwrite as we go down
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
const getAllStyles = (baseId, target, rawStyles) => {
  const styles = {
    [baseId]: {},
  }
  const propStyles = addStyles(baseId, styles, rawStyles)
  // merge child styles
  if (target[GLOSS_SIMPLE_COMPONENT_SYMBOL]) {
    const childConfig = target.getConfig()
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
  const sub = namespace.indexOf('&')
  if (sub === 0) {
    return '.' + className + namespace.slice(1)
  } else if (sub > 0) {
    return '.' + className + namespace.slice(sub + 1)
  }
  return '.' + className
}

export function createViewFactory(toCSS) {
  const tracker = new Map()
  const rulesToClass = new WeakMap()
  const sheet = new StyleSheet(process.env.NODE_ENV !== 'development')
  const gc = new GarbageCollector(sheet, tracker, rulesToClass)

  let idCounter = 1
  const uid = () => idCounter++ % Number.MAX_SAFE_INTEGER

  return function createView(a: any, b: RawRules): SimpleView {
    let target = a || 'div'
    let rawStyles = b
    let targetConfig
    let ignoreAttrs
    const isSimpleView = target[GLOSS_SIMPLE_COMPONENT_SYMBOL]
    if (isSimpleView) {
      targetConfig = target.getConfig()
    }
    // shorthand: view({ ... })
    if (typeof target === 'object' && !isSimpleView) {
      target = 'div'
      rawStyles = a
    }
    const targetElement = isSimpleView ? targetConfig.targetElement : target
    const id = `${uid()}`
    const { styles, propStyles } = getAllStyles(id, target, rawStyles)
    const hasPropStyles = !!Object.keys(propStyles).length
    let displayName = 'GlossView'
    let cachedTheme
    let ThemedView

    function getIgnoreAttrs() {
      const targetAttrs = targetConfig ? targetConfig.ignoreAttrs : null
      return ThemedView.ignoreAttrs || targetAttrs
    }

    function getTheme() {
      if (typeof cachedTheme !== 'undefined') {
        return cachedTheme
      }
      let themes = []
      let view = ThemedView
      // collect the themes going up the tree
      while (view) {
        if (view.themeFn) {
          themes.push(view.themeFn)
        }
        view = view.getConfig().child
      }
      let result
      if (!themes.length) {
        result = null
      } else {
        result = props => {
          let styles = {}
          // from most important to least
          for (const theme of themes) {
            styles = {
              ...theme(props),
              ...styles,
            }
          }
          return styles
        }
      }
      cachedTheme = result
      return result
    }

    function addRules(displayName: string, rules: BaseRules, namespace, tagName: string) {
      // if these rules have been cached to a className then retrieve it
      const cachedClass = rulesToClass.get(rules)
      if (cachedClass) {
        return cachedClass
      }
      const declarations = []
      const style = toCSS(rules)
      // generate css declarations based on the style object
      for (const key in style) {
        const val = style[key]
        declarations.push(`  ${key}: ${val};`)
      }
      const css = declarations.join('\n')
      // build the class name with the display name of the styled component and a unique id based on the css and namespace
      const className = displayName + '__' + hash(namespace + css)
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
          sheet.insert(namespace, `${namespace} {\n${selector} {\n${css}\n}\n}`)
        } else {
          sheet.insert(className, `${selector} {\n${css}\n}`)
        }
        rulesToClass.set(rules, className)
      }
      return className
    }

    function generateClassnames(
      state: State,
      props: CSSPropertySet,
      tagName: string,
      theme: ThemeObject,
    ) {
      // if this is a secondary render then check if the props are essentially equivalent
      const extraClassNames = []
      let myStyles = { ...styles }
      // if passed any classes from another styled component, ignore that class and merge in their
      // resolved styles
      if (props.className) {
        const propClassNames = props.className.trim().split(/[\s]+/g)
        for (const className of propClassNames) {
          const classInfo = tracker.get(className)
          if (classInfo) {
            const { namespace, style } = classInfo
            myStyles = {
              ...myStyles,
              [namespace]: style,
            }
          } else {
            extraClassNames.push(className)
          }
        }
      }
      const themeFn = getTheme()
      const hasDynamicStyles = theme || hasPropStyles
      // if we had the exact same rules as last time and they weren't dynamic then we can bail out here
      // if (!hasDynamicStyles && myStyles === state.lastStyles) {
      //   return null
      // }
      let dynamicStyles
      if (hasDynamicStyles) {
        dynamicStyles = { [id]: {} }
      }
      if (hasPropStyles) {
        for (const key in propStyles) {
          if (props[key] !== true) {
            continue
          }
          for (const styleKey in propStyles[key]) {
            const dynKey = styleKey === 'base' ? id : styleKey
            dynamicStyles[dynKey] = {
              ...dynamicStyles[dynKey],
              ...propStyles[key][styleKey],
            }
          }
        }
      }
      if (theme) {
        addStyles(id, dynamicStyles, themeFn({ ...props, theme }))
      }
      if (hasDynamicStyles) {
        // create new object to prevent buggy mutations
        myStyles = { ...myStyles }
        for (const key in dynamicStyles) {
          myStyles[key] = myStyles[key] || {}
          myStyles[key] = {
            ...myStyles[key],
            ...dynamicStyles[key],
          }
        }
      }
      const classNames = []
      // sort so we properly order pseudo keys
      const keys = Object.keys(myStyles)
      const sortedStyleKeys = keys.length > 1 ? keys.sort(pseudoSort) : keys

      // add rules
      for (const namespace of sortedStyleKeys) {
        const className = addRules(displayName, myStyles[namespace], namespace, tagName)
        classNames.push(className)
        // if this is the first mount render or we didn't previously have this class then add it as new
        if (state.classNames == null || !state.classNames.includes(className)) {
          gc.registerClassUse(state.uid, className)
        }
      }
      // check what classNames have been removed if this is a secondary render
      if (state.classNames !== null) {
        for (const className of state.classNames) {
          // if this previous class isn't in the current classes then deregister it
          if (!classNames.includes(className)) {
            gc.deregisterClassUse(state.uid, className)
          }
        }
      }
      return {
        classNames,
        extraClassNames,
      }
    }

    type State = {
      uid?: number
      classNames: string[]
      extraClassNames: string[]
      // TODO check this its a bit weird, we can probably do a hidden defineProp for equality
    }

    function getClassNamesFromProps(state: State, props: SimpleViewProps, theme: ThemeObject) {
      // update ignore attributes
      ignoreAttrs = ignoreAttrs || arrToDict(getIgnoreAttrs())
      const tag = props.tagName || typeof targetElement === 'string' ? targetElement : ''
      return generateClassnames(state, props, tag, theme)
    }

    // @ts-ignore react hooks
    ThemedView = React.memo((props: SimpleViewProps) => {
      // @ts-ignore react hooks
      const [state, setState] = React.useState({
        uid: Math.random(),
        classNames: null,
        extraClassNames: [],
      } as State)

      // @ts-ignore react hooks
      const { allThemes, activeThemeName } = React.useContext(ThemeContext)

      // @ts-ignore react hooks
      React.useEffect(() => {
        let theme
        if (getTheme()) {
          theme = allThemes[activeThemeName]
          // merge themes option
          if (typeof props.theme === 'object') {
            theme = {
              ...theme,
              ...props.theme,
            }
          }
        }

        const nextState = getClassNamesFromProps(state, props, theme)
        if (JSON.stringify(nextState) !== JSON.stringify(state)) {
          setState(nextState)
        }

        return () => {
          if (state.classNames) {
            for (const name of state.classNames) {
              gc.deregisterClassUse(state.uid, name)
            }
          }
        }
      })

      let finalProps
      const element = props.tagName || targetElement

      if (typeof element === 'string') {
        // if it's a DOM element, pass DOM attributes only
        finalProps = {}
        for (const key in props) {
          if (validProp(key)) {
            finalProps[key] = props[key]
          }
        }
      } else {
        // if it's passing down to a Component, pass anything
        finalProps = props
      }

      // className
      if (state.classNames) {
        finalProps.className = state.classNames.concat(state.extraClassNames).join(' ')
      }

      // forwardRef
      if (props.forwardRef) {
        if (typeof element === 'string') {
          // dom ref
          finalProps.ref = props.forwardRef
        } else {
          // probably another styled component so pass it down
          finalProps.forwardRef = props.forwardRef
        }
      }

      // ignoreAttrs
      if (state.ignoreAttrs && typeof state.ignoreAttrs === 'object') {
        for (const prop in props) {
          if (state.ignoreAttrs[prop]) {
            delete finalProps[prop]
          }
        }
      }

      return React.createElement(element, finalProps, props.children)
    })

    ThemedView.themeFn = null
    ThemedView.displayName = 'SimpleView'
    ThemedView.ignoreAttrs = null
    ThemedView[GLOSS_SIMPLE_COMPONENT_SYMBOL] = true
    ThemedView.withConfig = config => {
      if (config.displayName) {
        displayName = config.displayName
        ThemedView.displayName = displayName
      }
      return ThemedView
    }
    ThemedView.theme = themeFn => {
      ThemedView.themeFn = themeFn
      return ThemedView
    }
    ThemedView.getConfig = () => ({
      id,
      displayName,
      targetElement,
      ignoreAttrs: getIgnoreAttrs(),
      styles: { ...styles },
      propStyles: { ...propStyles },
      child: isSimpleView ? target : null,
    })

    return ThemedView
  }
}
