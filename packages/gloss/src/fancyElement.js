// @flow
import * as React from 'react'
import { StyleSheet, css } from './stylesheet'
import deepExtend from 'deep-extend'
import type { Gloss } from './index'
import tags from 'html-tags'

const VALID_TAGS = tags.reduce((acc, cur) => ({ ...acc, [cur]: true }), {})
const IS_PROD = process.env.NODE_ENV === 'production'

const arrayOfObjectsToObject = (arr: Array<Object>) => {
  let res = {}
  for (let i = 0; i < arr.length; i++) {
    deepExtend(res, arr[i])
  }
  return res
}
const ogCreateElement = (type: string | Function, ...args) =>
  React.createElement(type, ...args)
const TAG_NAME_MAP = {
  title: 'div',
  body: 'div',
  meta: 'div',
  head: 'div',
}
const $ = '$'

// factory that returns fancyElement helper
export default function fancyElementFactory(Gloss: Gloss, styles: Object) {
  const { baseStyles, options, niceStyle } = Gloss
  return function fancyElement(
    type_: string | Function,
    props?: Object,
    ...children: Array<any>
  ) {
    let type = type_
    if (!type) {
      throw new Error(
        `Didn't get a valid type: ${type}, props: ${JSON.stringify(
          props
        )}, children: ${children ? children.toString() : children}`
      )
    }
    let cssStyles
    const propNames = props ? Object.keys(props) : null
    const isTag = typeof type === 'string'
    const name: string = typeof type === 'function' ? `${type.name}` : type
    const finalProps = {}
    const finalStyles = []
    const { theme } = this

    const addStyle = (obj, key, val, checkTheme) => {
      const style = obj[key]
      if (!style) {
        return
      }
      // dynamic
      if (typeof style === 'function') {
        const sheet = StyleSheet.create({
          [name]: niceStyle(style(val)),
        })
        finalStyles.push(sheet[type])
      } else {
        finalStyles.push(style)
      }
      if (checkTheme && theme && theme[key]) {
        finalStyles.push(theme[key])
      }
    }

    if (styles && (isTag || type.name)) {
      const tagName = type.name || type
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
      const sheet = StyleSheet.create({ [name]: niceStyle(cssStyles) })
      finalStyles.push(sheet[type])
    }

    // styles => props
    if (finalStyles.length) {
      if (isTag) {
        // tags get className
        if (IS_PROD) {
          finalProps.className = css(...finalStyles)
        } else {
          try {
            finalProps.className = css(...finalStyles)
          } catch (e) {
            console.error('Error applying style to', name, finalStyles, this)
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
        if (props) {
          finalProps.style = arrayOfObjectsToObject([
            props.style,
            ...finalStyles.map(style => style && style.style),
          ])
        }
      }
    }

    if (isTag) {
      type = VALID_TAGS[name] ? name : 'div'
      type = TAG_NAME_MAP[name] || type
    }

    return ogCreateElement(type, finalProps, ...children)
  }
}
