// @flow
import React from 'react'
import { StyleSheet, css } from './stylesheet'
import { omit } from 'lodash'
import { filterStyleKeys, filterParentStyleKeys } from './helpers'
import deepExtend from 'deep-extend'

const flatten = arr => [].concat.apply([], arr)
const arrayOfObjectsToObject = (arr: Array<Object>) => {
  let res = {}
  for (let i = 0; i < arr.length; i++) {
    deepExtend(res, arr[i])
  }
  return res
}

const ogCreateElement = React.createElement.bind(React)

// function getDynamics(
//   activeKeys: Array<string>,
//   props: Object,
//   styles: Object,
//   propPrefix = '$'
// ) {
//   const dynamicKeys = activeKeys.filter(
//     k => styles[k] && typeof styles[k] === 'function'
//   )
//   const dynamics = dynamicKeys.reduce(
//     (acc, key) => ({
//       ...acc,
//       [key]: styles[key](props[`${propPrefix}${key}`]),
//     }),
//     {}
//   )
//   return dynamics
// }

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
  const SHOULD_THEME = !options.dontTheme && theme

  function getSheet(dynamics: Object, name: string) {
    const sheet = StyleSheet.create(applyNiceStyles(dynamics, `${name}`))
    return Object.keys(dynamics).map(key => ({
      ...sheet[key],
      isDynamic: true,
      key,
    }))
  }

  // const cache = new WeakMap()

  const PARENT_DYNAMICS = parentStyles.dynamics
  const PARENT_STATICS = parentStyles.statics
  const $ = '$'
  let isTag = null

  return function fancyElement(
    type: string | Function,
    props?: Object,
    ...children
  ) {
    const propNames = Object.keys(props)
    isTag = typeof type === 'string'
    // [tagname, ...props]
    if (isTag) {
      propNames.unshift(type)
    } else {
      console.log(
        'add name of propercased component hehe',
        type.name,
        type.constructor.name
      )
      // propNames.unshift(type.constructor.name)
    }
    const finalProps = {}
    const finalStyles = {}

    for (const NAME of propNames) {
      if (NAME[0] !== $) {
        continue
      }
      const val = props[NAME]
      if (val === false || val === null || val === undefined) {
        continue
      }
      const isParentStyle = NAME[1] === $

      let propStyle

      if (isParentStyle) {
        const key = NAME.slice(2)
        console.log('parentstyle', key)
        if (PARENT_DYNAMICS && PARENT_DYNAMICS[key]) {
          const styles = PARENT_DYNAMICS[NAME.slice(2)]
          finalStyles.push(StyleSheet.create(applyNiceStyles(styles(val))))
        } else if (PARENT_STATICS && PARENT_STATICS[key]) {
          finalStyles.push(PARENT_STATICS[key])
        }
      }

      // static
      if (styles.statics) {
        for (const key of allKeys) {
          finalStyles[key].push(styles.statics[key])
        }
      }

      // dynamic
      if (styles.dynamics && activeKeys.length) {
        const dynamics = getSheet(
          getDynamics(activeKeys, props, styles.dynamics)
        )
        for (const sheet of dynamics) {
          finalStyles[sheet.key].push(sheet)
        }
      }
    }

    if (activeStyles.length) {
      if (isTag) {
        // apply classname styles
        finalProps.className = css(...activeStyles)
        // keep original classNames
        if (props && props.className && typeof props.className === 'string') {
          finalProps.className += ` ${props.className}`
        }
      } else {
        // components get a style prop
        finalProps.style = arrayOfObjectsToObject(
          activeStyles.map(style => style && style.style)
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
