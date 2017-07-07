import React from 'react'
import SizedSurface from '../sizedSurface'
import { inject } from '@mcro/black'

function Input({ sync, type, name, uiContext, ...props }) {
  if (sync) {
    props.value = sync.get()
    props.onChange = e => sync.set(e.target.value)
  }

  if (uiContext && uiContext.inForm && !sync) {
    const ogOnChange = props.onChange
    uiContext.formValues[name] = props.initialValue || '' // set to initial value
    props.onChange = e => {
      uiContext.formValues[name] = e.target.value
      ogOnChange && ogOnChange(e)
    }
  }

  if (type === 'checkbox') {
    return <input type="checkbox" {...props} />
  }

  // glow
  // glowProps={{
  //   color: [255, 255, 255],
  // }}

  return (
    <SizedSurface
      $input
      sizeFont
      sizeRadius
      sizeHeight
      sizePadding
      flex
      borderWidth={1}
      wrapElement
      tagName="input"
      name={name}
      type={type}
      elementProps={{
        css: {
          width: '100%',
          padding: [0, 10],
        },
      }}
      {...props}
    />
  )
}

export default inject(context => ({ uiContext: context.uiContext }))(Input)
