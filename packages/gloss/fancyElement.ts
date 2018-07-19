import * as React from 'react'

const ogCreateElement = React.createElement.bind(React)
const IS_BROWSER = typeof window !== 'undefined'
const cssOpts = { snakeCase: false }
let cancelNextClick = false
let lastMouseDown = Date.now()

// TODO
// Put this on fancyElement.setClickInterrupt or something
setTimeout(() => {
  // @ts-ignore
  if (IS_BROWSER && window.addDragListener) {
    window.addEventListener('mousedown', () => {
      lastMouseDown = Date.now()
    })
    window.addEventListener('mouseup', () => {
      setTimeout(() => {
        cancelNextClick = false
      })
    })
    // @ts-ignore
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
