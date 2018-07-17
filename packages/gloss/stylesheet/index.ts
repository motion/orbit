/**
 * Copyright 2018-present Facebook.
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 * @format
 */

import { CSSPropertyValue, CSSPropertySet } from '@mcro/css'
import { GarbageCollector } from './gc'
import { StyleSheet } from './sheet'
import hash from './hash'
const React = require('react')

export type RawRules = CSSPropertySet & {
  [key: string]: CSSPropertySet
}

export type BaseRules = {
  [key: string]: CSSPropertyValue<string | number>
}

export type Tracker = Map<
  string,
  {
    displayName?: string
    namespace: string
    rules: BaseRules
    selector: string
    style: Object
  }
>

export type RulesToClass = WeakMap<BaseRules, string>

// map of inserted classes and metadata about them
export const tracker: Tracker = new Map()

// map of rules to their class
const rulesToClass: RulesToClass = new WeakMap()

export const sheet = new StyleSheet(process.env.NODE_ENV === 'production')
export const gc = new GarbageCollector(sheet, tracker, rulesToClass)

const buildRules = (..._) => _

function addRules(
  displayName: string,
  rules: BaseRules,
  namespace,
  props: Object,
  context: Object,
) {
  // if these rules have been cached to a className then retrieve it
  const cachedClass = rulesToClass.get(rules)
  if (cachedClass != null) {
    return cachedClass
  }

  //
  const declarations = []
  const style = buildRules(rules, props, context)

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

// remove all styhles
export function flush() {
  gc.flush()
  tracker.clear()
  sheet.flush()
}

class StyledComponentBase<Props> extends React.PureComponent {
  state = {
    classNames: [],
    extraClassNames: [],
    lastBuiltRules: null,
  }

  static extends(rules: RawRules, opts?: StyledComponentOpts) {
    return createStyledComponent(this, rules, opts)
  }

  componentWillMount(): void {
    this.generateClassnames(this.props, null)
  }

  componentWillReceiveProps(nextProps: Props): void {
    this.generateClassnames(nextProps, this.props)
  }

  componentWillUnmount(): void {
    for (const name of this.state.classNames) {
      gc.deregisterClassUse(name)
    }
  }

  generateClassnames(props: Props, prevProps?: Props): void {
    throw new Error('unimplemented')
  }
}

function hasEquivProps(props: any, nextProps: any): boolean {
  // check if the props are equivalent
  for (const key in props) {
    // ignore `children` since we do that check later
    if (key === 'children') {
      continue
    }
    // check strict equality of prop value
    if (nextProps[key] !== props[key]) {
      return false
    }
  }
  // check if nextProps has any values that props doesn't
  for (const key in nextProps) {
    if (!(key in props)) {
      return false
    }
  }
  // check if the boolean equality of children is equivalent
  if (Boolean(props.children) !== Boolean(nextProps.children)) {
    return false
  }
  return true
}

type StyledComponentOpts = {
  displayName?: string
  contextTypes?: Object
  ignoreAttributes?: Array<string>
}

function createStyledComponent(
  tagName: TagName,
  rules: RawRules,
  opts?: StyledComponentOpts = {},
): StyledComponent<any> {
  let { contextTypes = {}, ignoreAttributes } = opts

  // build up rules
  let builtRules = rules

  // if inheriting from another styled component then take all of it's properties
  if (typeof tagName === 'function' && tagName.STYLED_CONFIG) {
    // inherit context types
    if (tagName.contextTypes) {
      contextTypes = { ...contextTypes, ...tagName.contextTypes }
    }
    const parentConfig = tagName.STYLED_CONFIG
    // inherit tagname
    tagName = parentConfig.tagName
    // inherit ignoreAttributes
    if (parentConfig.ignoreAttributes) {
      if (ignoreAttributes) {
        ignoreAttributes = ignoreAttributes.concat(
          parentConfig.ignoreAttributes,
        )
      } else {
        ignoreAttributes = parentConfig.ignoreAttributes
      }
    }
    // inherit rules
    builtRules = Object.assign({}, parentConfig.builtRules, builtRules)
  }

  const displayName: string =
    opts.displayName == null ? 'StyledComponent' : opts.displayName
  const isDOM = typeof tagName === 'string'

  class Constructor extends StyledComponentBase<Props> {
    generateClassnames(props: Props, prevProps?: Props) {
      // if this is a secondary render then check if the props are essentially equivalent
      // NOTE: hasEquivProps is not a standard shallow equality test
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
            this.context,
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
      if (ignoreAttributes) {
        for (const key of ignoreAttributes) {
          delete props[key]
        }
      }
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
    ignoreAttributes,
    tagName,
  }

  return Constructor
}
