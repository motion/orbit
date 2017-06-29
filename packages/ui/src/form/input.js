import React from 'react'
import Surface from '../surface'

export default ({ sync, ...props }) => {
  if (sync) {
    props.value = sync.get()
    props.onChange = e => sync.set(e.target.value)
  }

  return <Surface
    $input
    flex
    borderRadius={0}
    wrapElement
    tagName="input"
    glint={[255,255,255, 0.1]}
    elementStyles={{
      width: '100%',
      padding: [0, 10],
    }}
    {...props}
  />
}
