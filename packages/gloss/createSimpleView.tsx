import { CSSPropertyValue, CSSPropertySet } from '@mcro/css'
import * as React from 'react'
// import { GlossView } from './types'
// import { ThemeContext } from './theme/ThemeContext'
import { GarbageCollector } from './stylesheet/gc'
import hash from './stylesheet/hash'
import { StyleSheet } from './stylesheet/sheet'
import css, { validCSSAttr } from '@mcro/css'

// import sonar

const addStyles = (id, baseStyles, nextStyles) => {
  for (const key of Object.keys(nextStyles)) {
    // dont overwrite as we go down
    if (typeof baseStyles[id][key] === 'undefined') {
      // valid attribute
      if (validCSSAttr(key)) {
        baseStyles[id][key] = nextStyles[key]
      }
    } else {
      // were defining a boolean prop style
      //   looks like: <Component tall />
      //   via: view({ color: 'red', tall: { height: '100%' } })
      const prop = key
      const styleObj = nextStyles[prop]
      if (typeof styleObj === 'object') {
        // dont overwrite as we go down
        if (typeof baseStyles[prop] === 'undefined') {
          baseStyles[prop] = styleObj
        }
      }
    }
  }
}

const getAllStyles = (id, target, rawStyles) => {
  const builtStyles = {
    [id]: {},
  }
  addStyles(id, builtStyles, rawStyles)
  let curView = target
  // merge the children
  while (curView.IS_GLOSSY) {
    const { child, styles } = curView.getConfig()
    if (styles) {
      addStyles(id, builtStyles, styles)
    }
    curView = child
  }
  return builtStyles
}

export type RawRules = CSSPropertySet & {
  [key: string]: CSSPropertySet
}
export type BaseRules = {
  [key: string]: CSSPropertyValue<string | number>
}
type Props = CSSPropertySet

export const tracker = new Map()
const rulesToClass = new WeakMap()
export const sheet = new StyleSheet(process.env.NODE_ENV === 'production')
export const gc = new GarbageCollector(sheet, tracker, rulesToClass)

// basicaly @mcro/css
const buildRules = css()

function addRules(
  displayName: string,
  rules: BaseRules,
  namespace,
  props: Object,
) {
  // if these rules have been cached to a className then retrieve it
  const cachedClass = rulesToClass.get(rules)
  if (cachedClass != null) {
    return cachedClass
  }
  const declarations = []
  const style = buildRules(rules, props)
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
        if (part[0] === '&') {
          return '.' + className + part.slice(1)
        } else {
          return '.' + className
        }
      })
      .join(', ')
    // insert the new style text
    tracker.set(className, { displayName, namespace, rules, selector, style })
    console.log('insert', `${selector} {\n${css}\n}`)
    sheet.insert(className, `${selector} {\n${css}\n}`)
    // if there's no dynamic rules then cache this
    if (true) {
      rulesToClass.set(rules, className)
    }
  }
  return className
}

class StyledComponentBase<T extends Object> extends React.PureComponent<T> {
  props: T
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
  componentWillUnmount(): void {
    for (const name of this.state.classNames) {
      gc.deregisterClassUse(name)
    }
  }
  generateClassnames(_a: T, _b: T) {
    throw new Error('unimplemented')
  }
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

export function createSimpleView(target: any, rawStyles: RawRules) {
  const id = uid()
  let styles = getAllStyles(id, target, rawStyles)
  console.log(JSON.stringify(styles, null, 2))
  let displayName = 'ComponentName'
  const isDOM = typeof target === 'string'

  class Constructor extends StyledComponentBase<Props> {
    generateClassnames(props: Props, prevProps?: Props) {
      console.log('styles', styles)
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
      // if we had the exact same rules as last time and they weren't dynamic then we can bail out here
      if (myStyles !== this.state.lastStyles) {
        const prevClasses = this.state.classNames
        const classNames = []
        // add rules
        for (const namespace in myStyles) {
          const className = addRules(
            displayName,
            myStyles[namespace],
            namespace,
            props,
          )
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
    }

    render() {
      const { children, innerRef, ...props } = this.props
      // build class names
      const className = this.state.classNames
        .concat(this.state.extraClassNames)
        .join(' ')
      if (props.is) {
        props.class = className
      } else {
        props.className = className
      }
      //
      if (innerRef) {
        if (isDOM) {
          // dom ref
          props.ref = innerRef
        } else {
          // probably another styled component so pass it down
          props.innerRef = innerRef
        }
      }
      return React.createElement(target, props, children)
    }
  }

  Constructor.withConfig = config => {
    if (config.displayName) {
      // set tagname and displayname
      displayName = config.displayName
      Constructor.displayName = config.displayName
    }
    return Constructor
  }

  Constructor.getConfig = () => ({
    styles,
    id,
  })

  return Constructor
}

// gloss
