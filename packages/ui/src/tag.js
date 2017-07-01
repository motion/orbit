import React from 'react'
import Surface from './surface'

export default props =>
  <Surface
    tagName="tag"
    background="#e5ebf1"
    color="#7d8fa0"
    fontWeight={700}
    borderWidth={1}
    padding={3}
    glint
    glow
    {...props}
    noElement
  />
