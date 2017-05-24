import React from 'react'
import { view } from '~/helpers'
import node from '~/views/editor/node'

@node
@view
export default class Quote {
  render({ node, ...props }) {
    return <blockquote {...props} />
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
