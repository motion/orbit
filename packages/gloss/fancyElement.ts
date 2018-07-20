import * as React from 'react'

const ogCreateElement = React.createElement.bind(React)
const cssOpts = { snakeCase: false }
const cache = new WeakMap()

// factory that returns fancyElement helper
export default function fancyElementFactory(Gloss) {
  const { options, css } = Gloss

  function fancyElement(type, props, ...children) {
    let finalProps = props

    if (props && options.glossProp) {
      const cached = cache.get(props)
      if (cached) {
        finalProps = cached
      } else {
        const val = props[options.glossProp]
        if (val) {
          finalProps = { ...props }
          delete finalProps[options.glossProp]
          const extraStyle = css(val, cssOpts)
          finalProps.style = { ...finalProps.style, ...extraStyle }
        }
        cache.set(props, finalProps)
      }
    }

    if (props && finalProps.style === false) {
      delete finalProps.style
    }

    return ogCreateElement(type, finalProps, ...children)
  }

  return fancyElement
}
