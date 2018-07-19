import { ThemeContext } from './theme/ThemeContext'
import { CSSPropertyValue, CSSPropertySet } from '@mcro/css'
import * as React from 'react'
import { GarbageCollector } from './stylesheet/gc'
import hash from './stylesheet/hash'
import { StyleSheet } from './stylesheet/sheet'
import { validCSSAttr } from '@mcro/css'
import validProp from './helpers/validProp'

export type RawRules = CSSPropertySet & {
  [key: string]: CSSPropertySet
}
export type BaseRules = {
  [key: string]: CSSPropertyValue<string | number>
}
type Props = CSSPropertySet

// import sonar

const addStyles = (id, baseStyles, nextStyles) => {
  for (const key of Object.keys(nextStyles)) {
    // dont overwrite as we go down
    if (typeof baseStyles[id][key] !== 'undefined') {
      continue
    }
    // valid attribute
    if (validCSSAttr(key)) {
      if (key[0] === '&') {
        baseStyles[key] = nextStyles[key]
      } else {
        baseStyles[id][key] = nextStyles[key]
      }
    } else {
      // were defining a boolean prop style
      //   looks like: <Component tall />
      //   via: view({ color: 'red', tall: { height: '100%' } })
      const prop = key
      const styleObj = nextStyles[key]
      if (typeof styleObj === 'object') {
        // dont overwrite as we go down
        if (typeof baseStyles[prop] === 'undefined') {
          baseStyles[prop] = {}
          for (const subKey of Object.keys(styleObj)) {
            if (subKey[0] === '&') {
              baseStyles[`${prop}${subKey}`] = styleObj[subKey]
            } else {
              baseStyles[prop][subKey] = styleObj[subKey]
            }
          }
        }
      }
    }
  }
}

const getAllStyles = (baseId, target, rawStyles) => {
  const builtStyles = {
    [baseId]: {},
  }
  addStyles(baseId, builtStyles, rawStyles)
  // merge child styles
  if (target.IS_GLOSSY) {
    const { id, styles } = target.getConfig()
    const moveToMyId = styles[id]
    delete styles[id]
    styles[baseId] = moveToMyId
    for (const key of Object.keys(styles)) {
      builtStyles[key] = {
        ...styles[key],
        ...builtStyles[key],
      }
    }
  }
  return builtStyles
}

export function simpleViewFactory(toCSS) {
  const tracker = new Map()
  const rulesToClass = new WeakMap()
  const sheet = new StyleSheet(process.env.NODE_ENV === 'production')
  const gc = new GarbageCollector(sheet, tracker, rulesToClass)

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
    // this is the first time we've found this className
    if (!tracker.has(className)) {
      // build up the correct selector, explode on commas to allow multiple selectors
      const selector = namespace
        .split(', ')
        .map(part => {
          const sub = part.indexOf('&')
          if (sub === 0) {
            return '.' + className + part.slice(1)
          } else if (sub > 0) {
            return '.' + className + part.slice(sub + 1)
          } else {
            return '.' + className
          }
        })
        .join(', ')
      // insert the new style text
      tracker.set(className, { displayName, namespace, rules, selector, style })
      sheet.insert(className, `${selector} {\n${css}\n}`)
      // if there's no dynamic rules then cache this
      if (true) {
        rulesToClass.set(rules, className)
      }
    }
    return className
  }

  function hasEquivProps(props: T, nextProps: T): boolean {
    for (const key in props) {
      if (key === 'children') {
        continue
      }
      if (nextProps[key] !== props[key]) {
        return false
      }
    }
    for (const key in nextProps) {
      if (!(key in props)) {
        return false
      }
    }
    if (Boolean(props.children) !== Boolean(nextProps.children)) {
      return false
    }
    return true
  }

  let idCounter = 1
  const uid = () => idCounter++ % Number.MAX_SAFE_INTEGER

  return function createSimpleView(target: any, rawStyles: RawRules) {
    const tagName = target.IS_GLOSSY ? target.getConfig().tagName : target
    const id = `${uid()}`
    let styles = getAllStyles(id, target, rawStyles)
    let displayName = 'ComponentName'
    const isDOM = typeof tagName === 'string'
    let ThemedConstructor
    let cachedTheme

    function getTheme() {
      if (cachedTheme) {
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

    function isNamespaceBooleanPropActive(namespace, props) {
      // remove inactive props, including boolean props
      if (namespace !== id && namespace[0] !== '&') {
        const psuedoIndex = namespace.indexOf('&')
        const namespaceWithoutPsuedo = namespace.slice(
          0,
          psuedoIndex === -1 ? namespace.length : psuedoIndex,
        )
        if (props[namespaceWithoutPsuedo] !== true) {
          return false
        }
      }
      return true
    }

    class Constructor extends React.PureComponent<Props> {
      state = {
        classNames: [],
        extraClassNames: [],
        lastStyles: null,
      }

      componentWillMount() {
        this.generateClassnames(this.props, null)
      }
      componentWillReceiveProps(nextProps: T) {
        this.generateClassnames(nextProps, this.props)
      }

      generateClassnames(props: Props, prevProps?: Props) {
        if (props.debug) {
          debugger
        }
        // if this is a secondary render then check if the props are essentially equivalent
        if (prevProps != null && hasEquivProps(props, prevProps)) {
          return
        }
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
              myStyles = Object.assign({}, myStyles, {
                [namespace]: style,
              })
            } else {
              extraClassNames.push(className)
            }
          }
        }
        const theme = getTheme()
        if (theme) {
          const themeStyles = { [id]: {} }
          addStyles(id, themeStyles, theme(props))
          for (const key of Object.keys(themeStyles)) {
            myStyles[key] = myStyles[key] || {}
            myStyles[key] = {
              ...myStyles[key],
              ...themeStyles[key],
            }
          }
        }
        // if we had the exact same rules as last time and they weren't dynamic then we can bail out here
        if (myStyles === this.state.lastStyles) {
          return
        }
        const prevClasses = this.state.classNames
        const classNames = []
        // add rules
        for (const namespace in myStyles) {
          const className = addRules(
            displayName,
            myStyles[namespace],
            namespace,
          )
          if (!isNamespaceBooleanPropActive(namespace, props)) {
            continue
          }
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
        this.setState({
          classNames,
          lastStyles: myStyles,
          extraClassNames,
        })
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
        const finalProps = {}
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
          const theme = allThemes[activeThemeName]
          return <Constructor theme={theme} {...props} />
        }}
      </ThemeContext.Consumer>
    )

    ThemedConstructor.IS_GLOSSY = true

    ThemedConstructor.withConfig = config => {
      if (config.displayName) {
        // set tagname and displayname
        displayName = config.displayName
        ThemedConstructor.displayName = config.displayName
      }
      return ThemedConstructor
    }

    ThemedConstructor.getConfig = () => ({
      tagName,
      styles: { ...styles },
      id,
      child: target.IS_GLOSSY ? target : null,
    })

    return ThemedConstructor
  }
}
