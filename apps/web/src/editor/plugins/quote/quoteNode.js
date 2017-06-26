import React from 'react'
import { view } from '@jot/black'
import { Button } from '@jot/ui'
import node from '/editor/node'

@node
@view
export default class Quote {
  render({ attributes, children }) {
    return (
      <blockquote {...attributes}>
        <mark contentEditable={false}>“</mark>
        {children}
      </blockquote>
    )
  }

  static style = {
    blockquote: {
      fontSize: 18,
      padding: [0, 0, 0, 40],
      margin: 0,
      fontStyle: 'italic',
      position: 'relative',
    },
    mark: {
      fontWeight: 900,
      fontFamily: 'Myriad',
      fontSize: 60,
      lineHeight: 1,
      color: [0, 0, 0, 0.1],
      position: 'absolute',
      top: -20,
      left: -5,
    },
  }
}
