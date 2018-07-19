import * as React from 'react'

const ogCreateElement = React.createElement.bind(React)

const IS_BROWSER = typeof window !== 'undefined'
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

const cssOpts = { snakeCase: false }

// factory that returns fancyElement helper
export default function fancyElementFactory(Gloss) {
  const { options, css } = Gloss

  function fancyElement(type, props, ...children) {
    const propNames = props ? Object.keys(props) : null

    if (propNames) {
      for (const prop of propNames) {
        const val = props && props[prop]
        // style={}
        if (prop === 'style') {
          props.style = props.style || {}
          props.style = { ...props.style, ...val }
          continue
        }
        // css={}
        if (options.glossProp && prop === options.glossProp) {
          if (val && Object.keys(val).length) {
            // css={}
            const extraStyle = css(val, cssOpts)
            props.style = props.style || {}
            props.style = { ...props.style, ...extraStyle }
          }
          continue
        }
      }
    }
    return ogCreateElement(type, props, ...children)
  }

  return fancyElement
}
