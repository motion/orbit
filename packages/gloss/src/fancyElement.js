// @flow
import * as React from 'react'
import deepExtend from 'deep-extend'
import tags from 'html-tags'
import svgTags from './svgTags'

const electronTags = ['webview']

const $ = '$'
const ogCreateElement = React.createElement.bind(React)
const VALID_TAGS = [...tags, ...svgTags, ...electronTags].reduce(
  (acc, cur) => ({ ...acc, [cur]: true }),
  {},
)

const arrayOfObjectsToObject = arr => {
  let res = {}
  for (let i = 0; i < arr.length; i++) {
    if (!arr[i]) {
      continue
    }
    deepExtend(res, arr[i])
  }
  return res
}

// tags that are dangerous to use
const TAG_NAME_MAP = {
  title: 'div',
  body: 'div',
  meta: 'div',
  head: 'div',
  item: 'div',
  text: 'div',
  col: 'div',
  main: 'div',
}

const IS_BROWSER = typeof window !== 'undefined'
let cancelNextClick = false
let lastMouseDown = Date.now()

// TODO
// Put this on fancyElement.setClickInterrupt or something
setTimeout(() => {
  if (IS_BROWSER && window.addDragListener) {
    window.addEventListener('mousedown', () => {
      lastMouseDown = Date.now()
    })
    window.addEventListener('mouseup', () => {
      setTimeout(() => {
        cancelNextClick = false
      })
    })
    window.addDragListener(() => {
      if (cancelNextClick) {
        return
      }
      if (Date.now() - lastMouseDown < 1000) {
        cancelNextClick = true
      }
    })
  }
}, 100)

// factory that returns fancyElement helper
export default function fancyElementFactory(Gloss, styles) {
  const { baseStyles, options, css } = Gloss
  const tagNameOption = options.tagName

  // Fast object reduce
  function objToCamel(style) {
    let newStyle = {}
    for (const name of Object.keys(style)) {
      if (name.indexOf('-')) {
        newStyle[Gloss.helpers.snakeToCamel(name)] = style[name]
      } else {
        newStyle[name] = style[name]
      }
    }
    return newStyle
  }

  const addStyle = (finalStyles, theme, obj, key, val, checkTheme) => {
    let style = obj[key]
    if (!style) {
      style = obj.getRule ? obj.getRule(key) : obj[key]
    }
    if (!style) {
      return null
    }
    // dynamic
    if (typeof style === 'function') {
      return css(style(val))
    } else {
      finalStyles.push(style)
    }
    if (checkTheme && theme) {
      const themeKey = `${key}--theme`
      const themeStyle = theme.getRule(themeKey)
      if (themeStyle) {
        finalStyles.push(themeStyle)
      }
    }
  }

  function fancyElement(
    type_: string | Function,
    props?: Object,
    ...children: Array<any>
  ) {
    let type = type_
    if (!type) {
      throw new Error(
        `Didn't get a valid type: ${type}, children: ${
          children ? children.toString() : children
        }`,
      )
    }
    if (!this) {
      return ogCreateElement(type, props, ...children)
    }
    let glossUID = this.constructor.glossUID
    if (props && props.glossUID) {
      glossUID = props.glossUID
      delete props.glossUID
    }
    const propNames = props ? Object.keys(props) : null
    const isTag = typeof type === 'string'
    const name = !isTag ? `${type.name}` : `${type}`
    const finalProps = {}
    const finalStyles = []
    const theme = this.theme

    if (name) {
      addStyle(finalStyles, theme, styles, `${name}--${glossUID}`, null, true)
    }

    let style
    if (propNames) {
      for (const prop of propNames) {
        const val = props && props[prop]
        // style={}
        if (prop === 'style') {
          style = { ...style, ...val }
          continue
        }
        // hacky hacky place to put this, should be out of gloss
        if (IS_BROWSER && prop === 'onClick' && typeof val === 'function') {
          const ogClick = val
          finalProps.onClick = function(...args) {
            if (cancelNextClick) {
              cancelNextClick = false
              return
            }
            return ogClick.call(this, ...args)
          }
          continue
        }
        // css={}
        if (options.glossProp && prop === options.glossProp) {
          if (val && Object.keys(val).length) {
            // css={}
            const extraStyle = css(val, { snakeCase: false })
            style = { ...style, ...extraStyle }
          }
          continue
        }
        // also hacky to put this here
        // tagName={}
        if (tagNameOption && prop === tagNameOption && isTag) {
          // lets it be optionally undefined/false
          if (val) {
            type = val
          }
          continue
        }
        // after tagname, css, style
        const notStyle = prop[0] !== $
        if (notStyle) {
          // pass props down if not glossProp style prop
          finalProps[prop] = val
          continue
        }
        // ignore most falsy values (except 0)
        if (val === false || val === null || val === undefined) {
          continue
        }
        // $$style={}
        if (baseStyles) {
          const isParentStyle = prop[1] === $
          if (isParentStyle) {
            const inlineStyle = addStyle(
              finalStyles,
              theme,
              styles,
              prop.slice(2),
              val,
              false,
            )
            if (inlineStyle) {
              style = { ...style, ...inlineStyle }
            }
            continue
          }
        }
        // $style={}
        if (styles) {
          const inlineStyle = addStyle(
            finalStyles,
            theme,
            styles,
            `${prop.slice(1)}--${glossUID}`,
            val,
            true,
          )
          if (inlineStyle) {
            style = { ...style, ...objToCamel(inlineStyle) }
          }
        }
      }
    }

    if (style) {
      finalProps.style = style
    }

    // styles => props
    if (finalStyles.length) {
      if (isTag) {
        // tags get className
        finalProps.className = finalStyles
          .map(x => x.className || x.selectorText.slice(1))
          .join(' ')

        // keep original finalStyles
        if (props && props.className) {
          if (typeof props.className === 'string') {
            finalProps.className += ` ${props.className}`
          }
        }
      } else {
        // children get a style prop
        if (props) {
          finalProps.style = objToCamel(
            arrayOfObjectsToObject([
              ...finalStyles.map(style => style && style.style),
              finalProps.style,
            ]),
          )
        }
      }
    }

    if (isTag) {
      if (name !== 'div') {
        if (!finalProps.className) {
          finalProps.className = name
        } else {
          finalProps.className += ` ${name}`
        }
        if (!VALID_TAGS[type]) {
          type = 'div'
        }
      }
      type = TAG_NAME_MAP[name] || type
    }

    return ogCreateElement(type, finalProps, ...children)
  }

  return fancyElement
}
