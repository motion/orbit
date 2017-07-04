import React from 'react'
import SizedSurface from '../sizedSurface'

export default ({ sync, type, ...props }) => {
  if (sync) {
    props.value = sync.get()
    props.onChange = e => sync.set(e.target.value)
  }

  if (type === 'checkbox') {
    return <input type="checkbox" {...props} />
  }

  return (
    <SizedSurface
      $input
      sizeFont
      sizeRadius
      sizeHeight
      flex
      borderWidth={1}
      wrapElement
      tagName="input"
      type={type}
      glint={[255, 255, 255, 0.1]}
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
