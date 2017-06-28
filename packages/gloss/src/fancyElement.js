// @flow
import React from 'react'
import { StyleSheet, css } from './stylesheet'
import { omit } from 'lodash'
import { filterStyleKeys, filterParentStyleKeys } from './helpers'
import deepExtend from 'deep-extend'
import type { Gloss } from './index'

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

// factory that returns fancyElement helper
export default function fancyElementFactory(Gloss: Gloss, styles: Object) {
  const { baseStyles, options, niceStyle } = Gloss
  return function fancyElement(
    type: string | Function,
    props?: Object,
    ...children
  ) {
    const propNames = props ? Object.keys(props) : null
    const isTag = typeof type === 'string'
    const finalProps = {}
    const finalStyles = []
    let style

    function addStyle(style, val) {
      if (!style) return
      if (typeof style === 'function') {
        console.log('push', style(val))
        finalStyles.push(StyleSheet.create(niceStyle(style(val))))
      } else {
        finalStyles.push(style)
      }
    }

    if (styles && (isTag || type.name)) {
      const tagName = type.name || type
      addStyle(styles[tagName])
    }

    if (propNames) {
      for (const NAME of propNames) {
        const val = props && props[NAME]
        if (NAME === 'style') {
          style = val
          continue
        }
        if (
          NAME === 'tagName' &&
          options.tagName &&
          isTag &&
          typeof val === 'string'
        ) {
          type = val
          continue
        }
        if (NAME[0] !== $) {
          // pass props down if not style prop
          finalProps[NAME] = val
          continue
        }
        if (val === false || val === null || val === undefined) {
          // ignore most falsy values (except 0)
          continue
        }
        // $$style
        if (baseStyles) {
          const isParentStyle = NAME[1] === $
          if (isParentStyle) {
            addStyle(baseStyles[NAME.slice(2)], val)
            continue
          }
        }
        if (styles) {
          // $style
          addStyle(styles[NAME.slice(1)], val)
        }
      }
    }

    // glossify and append style prop
    if (style) {
      const sheet = StyleSheet.create({ [type]: niceStyle(style) })
      finalStyles.push(sheet[type])
    }

    // styles => props
    if (finalStyles.length) {
      if (isTag) {
        // tags get className
        finalProps.className = css(...finalStyles)
        // keep original classNames
        if (props && props.className) {
          if (typeof props.className === 'string') {
            finalProps.className += ` ${props.className}`
          }
          // TODO: handle objects?
        }
      } else {
        // children get a style prop
        finalProps.style = arrayOfObjectsToObject(
          finalStyles.map(style => style && style.style)
        )
      }
    }

    return ogCreateElement(type, finalProps, ...children)
  }
}
