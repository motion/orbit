// @flow
import React from 'react'
import { StyleSheet, css } from './stylesheet'
import { omit } from 'lodash'
import { filterStyleKeys, filterParentStyleKeys } from './helpers'
import deepExtend from 'deep-extend'

export const filterStyleKeys = (arr: Array<string>) =>
  arr.filter(key => key[0] === '$' && key[1] !== '$')
export const filterParentStyleKeys = (arr: Array<string>) =>
  arr.filter(key => key[0] === '$' && key[1] === '$')

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

  const cache = new WeakMap()
  const $ = '$'
  let isString = null

  return function fancyElement(
    type: string | Function,
    props?: Object,
    ...children
  ) {
    const propsArr = Object.keys(props)
    isString = typeof type === 'string'
    if (isString) propsArr.unshift(type) // [tagname, ...props]
    const vals = []
    const finalProps = {}
    for (const prop of propsArr) {
      if (prop[0] !== $) continue
      const val = (vals[vals.length - 1] = prop)
      const isParentStyle = prop[1] === $
      if (isParentStyle) {
        if (parentStyles.dynamics) {
          const dynamics = getSheet()
          // getDynamics(parentStyleNames, props, parentStyles.dynamics, '$$')
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
          for (const sheet of dynamics) {
            finalStyles.parents.push(sheet)
          }
        }
        if (parentStyles.statics) {
          for (const key of parentStyleNames) {
            finalStyles.parents.push(parentStyles.statics[key])
          }
        }
      }
    }

    // <... $one $two /> keys
    const propKeys = props ? Object.keys(props) : []
    const styleKeys = filterStyleKeys(propKeys)

    // remove $
    const activeKeys = styleKeys
      .filter(key => props[key] !== false && typeof props[key] !== 'undefined')
      .map(key => key.slice(1))

    //
    // 2. static style styles
    //
    // static
    if (styles.statics) {
      for (const key of allKeys) {
        finalStyles[key].push(styles.statics[key])
      }
    }

    // dynamic
    if (styles.dynamics && activeKeys.length) {
      const dynamics = getSheet(getDynamics(activeKeys, props, styles.dynamics))
      for (const sheet of dynamics) {
        finalStyles[sheet.key].push(sheet)
      }
    }

    //
    // 3. theme prop styles
    //

    if (SHOULD_THEME) {
      const { themeProp } = options
      const { theme } = this.constructor
      let themeKeys = theme && Object.keys(theme)

      if (!theme && themeKeys) {
        let activeThemeKey
        let activeTheme

        // activeThemeKey
        if (this.context.uiActiveTheme) {
          activeThemeKey = this.context.uiActiveTheme
          // theme comes first, so it can be overriden
          themeKeys = [themeProp, ...themeKeys]
        }
        if (themeProp) {
          if (this.props[themeProp]) {
            activeThemeKey = this.props[themeProp]
          }
          // allow disabling theme entirely
          if (this.props[themeProp] === false) {
            activeThemeKey = false
          }
        }

        // get it
        if (activeThemeKey) {
          activeTheme = this.context.uiTheme[activeThemeKey]
        }

        // loop over themes and apply
        for (const prop of themeKeys) {
          const isDynamic = typeof theme[prop] === 'function'

          // static theme
          if (!isDynamic) {
            if (this.props[prop] === true) {
              for (const key of allKeys) {
                finalStyles[key].push(styles.statics[`${prop}-${key}`])
              }
            }
          } else {
            // dynamic theme
            const hasProp =
              typeof this.props[prop] !== 'undefined' ||
              (themeProp === prop && activeTheme)

            if (hasProp) {
              // dynamic themes
              const dynStyles = theme[prop](this.props, activeTheme)
              const dynKeys = Object.keys(dynStyles).filter(
                tag => allKeys.indexOf(tag) > -1
              )

              if (dynKeys.length) {
                const activeDynamics = dynKeys.reduce(
                  (acc, cur) => ({ ...acc, [cur]: dynStyles[cur] }),
                  {}
                )
                const dynamics = getSheet(activeDynamics)
                for (const sheet of dynamics) {
                  finalStyles[sheet.key].push(sheet)
                }
              }
            }
          }
        }
      }
    }

    //
    // finish
    //

    const hasStyleProp = props && props.style && props.style.gloss === true
    const allStyleProps = propKeys.filter(
      key => key[0] === '$' || (hasStyleProp && key === 'style')
    )
    const newProps = omit(props, [
      (options.tagName && props && props.tagName && 'tagName') || undefined,
      ...allStyleProps,
    ])
    const allStyleKeys = isTag ? [type, ...allStyleProps] : allStyleProps

    // this collects the styles in the right order
    const activeStyles = flatten(
      allStyleKeys.map(key => {
        if (key[1] === '$') {
          const k = key.slice(2)
          return finalStyles.parents.filter(x => x && x.key === k)
        } else if (key[0] === '$') {
          return finalStyles[key.slice(1)]
        } else if (key === 'style') {
          return { style: props.style }
        } else {
          return finalStyles[key]
        }
      })
    ).filter(style => !!style)

    if (activeStyles.length) {
      if (isTag) {
        // apply classname styles
        newProps.className = css(...activeStyles)
        // keep original classNames
        if (props && props.className && typeof props.className === 'string') {
          newProps.className += ` ${props.className}`
        }
      } else {
        // components get a style prop
        newProps.style = arrayOfObjectsToObject(
          activeStyles.map(style => style && style.style)
        )
      }
    }

    // change tagname after applying styles so the original named element gets the right style
    if (isTag && options.tagName && props && props.tagName) {
      type = props.tagName
    }

    console.log(type)

    return ogCreateElement(type, newProps, ...children)
  }
}
