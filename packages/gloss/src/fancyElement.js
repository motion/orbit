// @flow
import React from 'react'
import { StyleSheet, css } from './stylesheet'
import { omit } from 'lodash'
import { filterStyleKeys, filterParentStyleKeys } from './helpers'
import deepExtend from 'deep-extend'

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

// factory that returns fancyElement helper
export default function fancyElementFactory(
  theme: Object,
  parentStyles: Object,
  styles: Object,
  options: Object,
  applyNiceStyles: Function
) {
  const STYLE_STATICS = (styles && styles.statics) || {}
  const STYLE_DYNAMICS = (styles && styles.dynamics) || {}
  const PARENT_DYNAMICS = (parentStyles && parentStyles.dynamics) || {}
  const PARENT_STATICS = (parentStyles && parentStyles.statics) || {}
  const $ = '$'

  return function fancyElement(
    type: string | Function,
    props?: Object,
    ...children
  ) {
    const propNames = props ? Object.keys(props) : null
    const isTag = typeof type === 'string'
    const finalProps = {}
    const finalStyles = []

    if (isTag || type.name) {
      const tagName = type.name || type
      if (STYLE_STATICS[tagName]) {
        finalStyles.push(STYLE_STATICS[tagName])
      }
      if (STYLE_DYNAMICS[tagName]) {
        finalStyles.push(
          StyleSheet.create(applyNiceStyles(STYLE_DYNAMICS[tagName](val)))
        )
      }
    }

    if (propNames) {
      for (const NAME of propNames) {
        const val = props && props[NAME]

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
        const isParentStyle = NAME[1] === $
        if (isParentStyle) {
          const key = NAME.slice(2)
          console.log('parentstyle', key)
          if (PARENT_DYNAMICS && PARENT_DYNAMICS[key]) {
            finalStyles.push(
              StyleSheet.create(applyNiceStyles(PARENT_DYNAMICS[key](val)))
            )
          } else if (PARENT_STATICS && PARENT_STATICS[key]) {
            finalStyles.push(PARENT_STATICS[key])
          }
          continue
        }

        // $style
        const key = NAME.slice(1)
        if (STYLE_STATICS[key]) {
          finalStyles.push(STYLE_STATICS[key])
          continue
        }
        if (STYLE_DYNAMICS[key]) {
          finalStyles.push(
            StyleSheet.create(applyNiceStyles(STYLE_DYNAMICS[key](val)))
          )
          continue
        }
      }
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

    // change tagname after applying styles so the original named element gets the right style
    if (isTag && options.tagName && props && props.tagName) {
      type = props.tagName
    }

    return ogCreateElement(type, finalProps, ...children)
  }
}
