import * as React from 'react'
import { ThemeContext } from './theme/ThemeContext'
import { CSSPropertyValue, CSSPropertySet, validCSSAttr } from '@mcro/css'
import { GarbageCollector } from './stylesheet/gc'
import hash from './stylesheet/hash'
import { StyleSheet } from './stylesheet/sheet'
import validProp from './helpers/validProp'
import { GLOSS_SIMPLE_COMPONENT_SYMBOL } from './gloss'
import reactFastCompare from 'react-fast-compare'

export type RawRules = CSSPropertySet & {
  [key: string]: CSSPropertySet
}
export type BaseRules = {
  [key: string]: CSSPropertyValue<string | number>
}
type Props = CSSPropertySet

const isHMREnabled =
  process.env.NODE_ENV === 'development' &&
  typeof module !== 'undefined' &&
  !!module['hot']

const recentHMR = () => {
  const lastHMR = +window['__lastHMR']
  return Date.now() - lastHMR < 400
}

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

export function createViewFactory(toCSS) {
  const tracker = new Map()
  const rulesToClass = new WeakMap()
  const sheet = new StyleSheet(process.env.NODE_ENV !== 'development')
  const gc = new GarbageCollector(sheet, tracker, rulesToClass)

  let idCounter = 1
  const uid = () => idCounter++ % Number.MAX_SAFE_INTEGER

  return function createView(a: any, b: RawRules) {
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
    const tagName = isSimpleView ? targetConfig.tagName : target
    const id = `${uid()}`
    const { styles, propStyles } = getAllStyles(id, target, rawStyles)
    const hasPropStyles = Object.keys(propStyles).length
    const isDOM = typeof tagName === 'string'
    let displayName = 'ComponentName'
    let ThemedConstructor
    let cachedTheme

    function getIgnoreAttrs() {
      const targetAttrs = targetConfig ? targetConfig.ignoreAttrs : null
      return ThemedConstructor.ignoreAttrs || targetAttrs
    }

    function getTheme() {
      if (typeof cachedTheme !== 'undefined') {
        return cachedTheme
      }
      let themes = []
      let view = ThemedConstructor
      while (view) {
        if (view.theme) {
          themes.push(view.theme)
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

    function getSelector(className: string, namespace: string) {
      if (namespace[0] === '@') {
        return '.' + className
      }
      const sub = namespace.indexOf('&')
      if (sub === 0) {
        return '.' + className + namespace.slice(1)
      } else if (sub > 0) {
        return '.' + className + namespace.slice(sub + 1)
      }
      return '.' + className
    }

    function addRules(displayName: string, rules: BaseRules, namespace) {
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
        const selector = getSelector(className, namespace)
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
        // if there's no dynamic rules then cache this
        if (true) {
          rulesToClass.set(rules, className)
        }
      }
      return className
    }

    function generateClassnames(
      styles,
      state,
      props: CSSPropertySet,
      prevProps: CSSPropertySet,
    ) {
      // if this is a secondary render then check if the props are essentially equivalent
      const extraClassNames = []
      let myStyles = styles
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
      const theme = getTheme()
      const hasDynamicStyles = theme || hasPropStyles
      // if we had the exact same rules as last time and they weren't dynamic then we can bail out here
      if (!hasDynamicStyles && myStyles === state.lastStyles) {
        return null
      }
      myStyles = { ...myStyles }
      let dynamicStyles
      if (hasDynamicStyles) {
        dynamicStyles = { [id]: {} }
      }
      if (hasPropStyles) {
        for (const key in propStyles) {
          if (props[key] !== true) continue
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
        addStyles(id, dynamicStyles, theme(props))
      }
      if (hasDynamicStyles) {
        for (const key in dynamicStyles) {
          myStyles[key] = myStyles[key] || {}
          myStyles[key] = {
            ...myStyles[key],
            ...dynamicStyles[key],
          }
        }
      }
      const prevClasses = state.classNames
      const classNames = []
      // add rules
      for (const namespace in myStyles) {
        const className = addRules(displayName, myStyles[namespace], namespace)
        classNames.push(className)
        // if this is the first mount render or we didn't previously have this class then add it as new
        if (prevProps == null || !prevClasses.includes(className)) {
          gc.registerClassUse(className)
        }
      }
      // check what classNames have been removed if this is a secondary render
      if (prevProps != null) {
        for (const className of prevClasses) {
          // if this previous class isn't in the current classes then deregister it
          if (!classNames.includes(className)) {
            gc.deregisterClassUse(className)
          }
        }
      }
      return {
        classNames,
        lastStyles: myStyles,
        extraClassNames,
      }
    }

    type State = {
      classNames: string[]
      extraClassNames: string[]
      lastStyles?: Object
      ignoreAttrs?: Object
      prevProps?: Object
    }

    class Constructor extends React.PureComponent<Props> {
      state = {
        classNames: [],
        extraClassNames: [],
        lastStyles: null,
        ignoreAttrs: null,
        prevProps: null,
      }

      static getDerivedStateFromProps(props: Props, state: State) {
        const noRecentHMR = isHMREnabled ? !recentHMR() : true
        const hasSameProps = reactFastCompare(props, state.prevProps)
        const shouldAvoidUpdate = noRecentHMR && hasSameProps
        if (shouldAvoidUpdate) {
          return null
        }
        let nextState: Partial<State> = {}
        // update ignore attributes
        ignoreAttrs = ignoreAttrs || getIgnoreAttrs()
        if (ignoreAttrs && !state.ignoreAttrs) {
          nextState.ignoreAttrs = arrToDict(ignoreAttrs)
        }
        return {
          ...nextState,
          ...generateClassnames(styles, state, props, state.prevProps),
          prevProps: props,
        }
      }

      componentWillUnmount() {
        for (const name of this.state.classNames) {
          gc.deregisterClassUse(name)
        }
      }

      render() {
        const props = this.props
        const { children, forwardRef } = props
        // build final props without weird attrs
        const finalProps: Props = {}
        // build class names
        const className = this.state.classNames
          .concat(this.state.extraClassNames)
          .join(' ')
        for (const key of Object.keys(props)) {
          if (validProp(key)) {
            finalProps[key] = props[key]
          }
        }
        if (props.is) {
          finalProps.class = className
        } else {
          finalProps.className = className
        }
        //
        if (forwardRef) {
          if (isDOM) {
            // dom ref
            finalProps.ref = forwardRef
          } else {
            // probably another styled component so pass it down
            finalProps.forwardRef = forwardRef
          }
        }
        if (this.state.ignoreAttrs) {
          for (const prop in finalProps) {
            if (this.state.ignoreAttrs[prop]) {
              delete finalProps[prop]
            }
          }
        }
        return React.createElement(
          // accept custom tagname overrides
          props.tagName || tagName,
          finalProps,
          children,
        )
      }
    }

    ThemedConstructor = props => (
      <ThemeContext.Consumer>
        {({ allThemes, activeThemeName }) => {
          if (!allThemes) {
            return <Constructor {...props} />
          }
          const theme = allThemes[activeThemeName]
          return <Constructor theme={theme} {...props} />
        }}
      </ThemeContext.Consumer>
    )

    ThemedConstructor[GLOSS_SIMPLE_COMPONENT_SYMBOL] = true

    ThemedConstructor.withConfig = config => {
      if (config.displayName) {
        // set tagname and displayname
        displayName = config.displayName
        ThemedConstructor.displayName = config.displayName
      }
      return ThemedConstructor
    }

    ThemedConstructor.getConfig = () => ({
      id,
      displayName,
      tagName,
      ignoreAttrs: getIgnoreAttrs(),
      styles: { ...styles },
      propStyles: { ...propStyles },
      child: isSimpleView ? target : null,
    })

    return ThemedConstructor
  }
}
