import { CSSPropertyValue, CSSPropertySet } from '@mcro/css'
import * as React from 'react'
import { GlossView } from './types'
import { ThemeContext } from './theme/ThemeContext'
import { GarbageCollector } from './stylesheet/gc'
import hash from './stylesheet/hash'
import { StyleSheet } from './stylesheet/sheet'

// import sonar

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
const buildRules = (..._) => ({})

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
          return '.' + className + ' ' + part
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

class StyledComponentBase<T extends Object> extends React.PureComponent<T> {
  props: T
  state = {
    classNames: [],
    extraClassNames: [],
    lastBuiltRules: null,
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

export function createGlossView(target: any, styles: RawRules) {
  // TODO make it extend
  let builtRules = styles
  let displayName = 'ComponentName'
  let tagName = 'div'
  const isDOM = typeof tagName === 'string'

  class Constructor extends StyledComponentBase<Props> {
    generateClassnames(props: Props, prevProps?: Props) {
      // if this is a secondary render then check if the props are essentially equivalent
      if (prevProps != null && hasEquivProps(props, prevProps)) {
        return
      }
      const extraClassNames = []
      let myBuiltRules = builtRules
      // if passed any classes from another styled component, ignore that class and merge in their
      // resolved styles
      if (props.className) {
        const propClassNames = props.className.trim().split(/[\s]+/g)
        for (const className of propClassNames) {
          const classInfo = tracker.get(className)
          if (classInfo) {
            const { namespace, style } = classInfo
            myBuiltRules = Object.assign({}, myBuiltRules, {
              [namespace]: style,
            })
          } else {
            extraClassNames.push(className)
          }
        }
      }
      // if we had the exact same rules as last time and they weren't dynamic then we can bail out here
      if (myBuiltRules !== this.state.lastBuiltRules) {
        const prevClasses = this.state.classNames
        const classNames = []
        // add rules
        for (const namespace in myBuiltRules) {
          const className = addRules(
            displayName,
            myBuiltRules[namespace],
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
          lastBuiltRules: myBuiltRules,
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
      return React.createElement(tagName, props, children)
    }
  }
  Constructor.STYLED_CONFIG = {
    builtRules,
    // ignoreAttributes,
    // tagName,
  }
  return Constructor
}

// gloss

export const createSimpleView = (target, styles) => {
  const isParentComponent = target[GLOSS_SIMPLE_COMPONENT_SYMBOL]
  const id = `_${uid()}`
  let name = target.name || target
  let displayName = name
  let themeUpdate
  let hasTheme
  let hasAttachedStyles = false
  let targetElement = target
  if (isParentComponent) {
    targetElement = name = targetElement.tagName || 'div'
  }
  let styleClassName
  const View: GlossView<any> = allProps => {
    // allow View.defaultProps
    // @ts-ignore
    const { forwardRef, className, ...props } = {
      ...View.defaultProps,
      ...allProps,
    }
    // attach theme/styles on first use
    if (!hasAttachedStyles) {
      try {
        View.compiledStyles = getAllStyles(View, name)
        attachStyles(id, View.compiledStyles)
        styleClassName = stylesheet
          .getRule(`${name}--${id}`)
          .selectorText.slice(1)
      } catch (err) {
        console.log('error attaching styles', target, name, styles)
        console.log('err', err)
      }
      hasAttachedStyles = true
    }
    const createElement = (extraClassName?) => {
      const el = createSimpleElement(
        targetElement,
        {
          ref: forwardRef,
          [`data-name`]: displayName,
          className: `${className || ''} ${styleClassName} ${extraClassName ||
            ''}`,
          ...props,
        },
        id,
      )
      return el
    }
    // themes!
    // we aren't just wrapping attachTheme on View because it adds a big layer for every simple view
    // we only attach themes now if they actually need it, to save a lot of nesting.
    if (typeof hasTheme === 'undefined') {
      hasTheme = checkHasTheme(View, isParentComponent)
    }
    if (hasTheme) {
      // detect child or parent theme
      if (!themeUpdate) {
        themeUpdate = createThemeManager(id, getAllThemes(View), name)
      }
      return (
        <ThemeContext.Consumer>
          {({ allThemes, activeThemeName }) => {
            themeUpdate(props, null, allThemes[activeThemeName])
            const themeClassName = themeSheet
              .getRule(`${name}--${id}--theme`)
              .selectorText.slice(1)
            return createElement(themeClassName)
          }}
        </ThemeContext.Consumer>
      )
    }
    // no theme
    return createElement()
  }
  View.style = styles
  View.displayName = targetElement
  View.tagName = name
  if (isParentComponent) {
    View.child = target
  }
  View.withConfig = config => {
    if (config.displayName) {
      // set tagname and displayname
      displayName = config.displayName
      View.displayName = config.displayName
    }
    return View
  }
  View[GLOSS_SIMPLE_COMPONENT_SYMBOL] = true
  // forward ref
  return View
}
