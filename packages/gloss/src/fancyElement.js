// @flow
import React from 'react'
import { jss } from './stylesheet'

import deepExtend from 'deep-extend'
import type { Gloss } from './index'

const IS_PROD = process.env.NODE_ENV === 'production'

const arrayOfObjectsToObject = (arr: Array<Object>) => {
  let res = {}
  for (let i = 0; i < arr.length; i++) {
    deepExtend(res, arr[i])
  }
  return res
}
const ogCreateElement = React.createElement.bind(React)
const TAG_NAME_MAP = {
  title: 'x-title',
  meta: 'x-meta',
}
const $ = '$'

const MasterSheet = jss.createStyleSheet({}).attach()

window.MasterSheet = MasterSheet

// factory that returns fancyElement helper
export default function fancyElementFactory(Gloss: Gloss, styles: Object) {
  const { baseStyles, options, niceStyle } = Gloss
  const SHOULD_THEME = !options.dontTheme
  return function fancyElement(
    type: string | Function,
    props?: Object,
    ...children
  ) {
    let cssStyles
    const propNames = props ? Object.keys(props) : null
    const isTag = typeof type === 'string'
    const finalProps = {}
    const classNames = []
    const tagName = type.name || type

    const addStyle = (obj, key, val, checkTheme) => {
      const style = obj[key]
      if (!style) return
      if (typeof style === 'function') {
        const styles = niceStyle(style(val))
        const rule = MasterSheet.addRule(`${tagName}.${key}`, styles)
        classNames.push(rule.className)
      } else {
        classNames.push(style.className)
      }
      if (SHOULD_THEME && checkTheme && this.theme && this.theme[key]) {
        classNames.push(this.theme[key].className)
      }
    }

    if (styles && (isTag || type.name)) {
      addStyle(styles, tagName, null, true)
    }

    if (propNames) {
      for (const NAME of propNames) {
        const val = props && props[NAME]

        // non-style actions
        if (options.glossProp && NAME === options.glossProp) {
          // css={}
          cssStyles = val
          continue
        }
        if (
          options.tagName &&
          NAME === options.tagName &&
          isTag &&
          typeof val === 'string'
        ) {
          // tagName={}
          type = val
          continue
        }
        if (NAME[0] !== $) {
          // pass props down if not glossProp style prop
          finalProps[NAME] = val
          continue
        }

        // style actions
        if (val === false || val === null || val === undefined) {
          // ignore most falsy values (except 0)
          continue
        }
        if (baseStyles) {
          // $$style
          const isParentStyle = NAME[1] === $
          if (isParentStyle) {
            addStyle(baseStyles, NAME.slice(2), val)
            continue
          }
        }
        if (styles) {
          // $style
          addStyle(styles, NAME.slice(1), val, true)
        }
      }
    }

    // glossify and append style prop
    if (cssStyles) {
      const styles = niceStyle(cssStyles)
      const rule = MasterSheet.addRule(`${tagName}.css`, styles)
      classNames.push(rule.className)
      // console.log('add', styles, rule.className)
    }

    // styles => props
    if (classNames.length) {
      if (isTag) {
        // tags get className
        if (IS_PROD) {
          finalProps.className = `${classNames.join(' ')}`
        } else {
          try {
            finalProps.className = `${classNames.join(' ')}`
          } catch (e) {
            console.error('Error applying style to', type, classNames, this)
          }
        }

        // keep original classNames
        if (props && props.className) {
          if (typeof props.className === 'string') {
            finalProps.className += ` ${props.className}`
          }
        }
      } else {
        // children get a style prop
        finalProps.style = arrayOfObjectsToObject([
          props.style,
          ...classNames.map(style => style && style.style),
        ])
      }
    }

    return ogCreateElement(type, finalProps, ...children)
  }
}
