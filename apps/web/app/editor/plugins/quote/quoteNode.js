import React from 'react'
import { view } from '~/helpers'
import { Button } from '~/ui'
import node from '~/editor/node'

@node
@view
export default class Quote {
  render({ attributes, children }) {
    return <blockquote {...attributes}>{children}</blockquote>
  }

  static style = {
    blockquote: {
      borderLeft: `2px solid #ddd`,
      fontSize: 18,
      paddingLeft: 10,
      marginLeft: 0,
      marginRight: 0,
      fontStyle: 'italic',
    },
  }
}
