// @flow
import React from 'react'
import { StyleSheet, css } from './stylesheet'
import { omit } from 'lodash'
import {
  applyNiceStyles,
  filterStyleKeys,
  filterParentStyleKeys,
} from './helpers'
import deepExtend from 'deep-extend'

const flatten = arr => [].concat.apply([], arr)
const arrayOfObjectsToObject = arr => {
  let res = {}
  for (let i = 0; i < arr.length; i++) {
    deepExtend(res, arr[i])
  }
  return res
}

const ogCreateElement = React.createElement.bind(React)

function getDynamics(
  activeKeys: Array<string>,
  props: Object,
  styles: Object,
  propPrefix = '$'
) {
  const dynamicKeys = activeKeys.filter(
    k => styles[k] && typeof styles[k] === 'function'
  )
  const dynamics = dynamicKeys.reduce(
    (acc, key) => ({
      ...acc,
      [key]: styles[key](props[`${propPrefix}${key}`]),
    }),
    {}
  )
  return dynamics
}

function getSheet(dynamics, name: string) {
  const sheet = StyleSheet.create(applyNiceStyles(dynamics, `${name}`))
  return Object.keys(dynamics).map(key => ({
    ...sheet[key],
    isDynamic: true,
    key,
  }))
}

const TAG_NAME_MAP = {
  title: 'x-title',
  meta: 'x-meta',
}

// factory that returns fancyElement helper
export default function fancyElementFactory(theme, parentStyles, styles, opts) {
  const shouldTheme = !opts.dontTheme
  const processTheme = shouldTheme && theme

  return function fancyElement(type, props, ...children) {
    // <... $one $two /> keys
    const propKeys = props ? Object.keys(props) : []
    const styleKeys = filterStyleKeys(propKeys)

    // remove $
    const activeKeys = styleKeys
      .filter(key => props[key] !== false && typeof props[key] !== 'undefined')
      .map(key => key.slice(1))

    // tag + $props
    // don't style <Components />!
    const isTag = typeof type === 'string'
    const allKeys = isTag ? [type, ...activeKeys] : activeKeys

    // collect styles, in order
    // { propKey: [styles] }
    const finalStyles = allKeys.reduce(
      (acc, cur) => {
        acc[cur] = []
        return acc
      },
      { parents: [] }
    )

    //
    // 1. parent styles
    //
    let parentStyleKeys

    if (parentStyles) {
      parentStyleKeys = filterParentStyleKeys(propKeys)

      if (parentStyleKeys.length) {
        const parentStyleNames = parentStyleKeys.map(k => k.replace('$$', ''))

        // dynamic
        if (parentStyles.dynamics) {
          const dynamics = getSheet(
            getDynamics(parentStyleNames, props, parentStyles.dynamics, '$$')
          )
          for (const sheet of dynamics) {
            finalStyles.parents.push(sheet)
          }
        }

        // static
        if (parentStyles.statics) {
          for (const key of parentStyleNames) {
            finalStyles.parents.push(parentStyles.statics[key])
          }
        }
      }
    }

    //
    // 2. own styles
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
    // 3. theme styles
    //
    let themeKeys

    if (processTheme) {
      // direct
      const { theme } = this.constructor
      themeKeys = theme && Object.keys(theme)

      if (theme && themeKeys.length) {
        let activeThemeKey
        let activeTheme

        // activeThemeKey
        if (this.context.uiActiveTheme) {
          activeThemeKey = this.context.uiActiveTheme
          // theme comes first, so it can be overriden
          themeKeys = [opts.themeKey, ...themeKeys]
        }
        if (opts.themeKey) {
          if (this.props[opts.themeKey]) {
            activeThemeKey = this.props[opts.themeKey]
          }
          // allow disabling theme entirely
          if (this.props[opts.themeKey] === false) {
            activeThemeKey = false
          }
        }

        // get it
        if (activeThemeKey) {
          activeTheme = this.context.uiTheme[activeThemeKey]
        }

        // loop over themes and apply
        for (const prop of themeKeys) {
          const isDynamic = typeof styles.theme[prop] === 'function'

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
              (opts.themeKey === prop && activeTheme)

            if (hasProp) {
              // dynamic themes
              const dynStyles = styles.theme[prop](
                this.props,
                this.context,
                activeTheme
              )
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
      opts.tagName ? props && props.tagName : undefined,
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

    if (opts.tagName && props && props.tagName) {
      type = props.tagName
      delete props.tagName
    }

    return ogCreateElement(type, newProps, ...children)
  }
}
