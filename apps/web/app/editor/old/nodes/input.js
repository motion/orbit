import React from 'react'
import { view } from '~/helpers'
import node from '~/editor/node'

@node
@view
export default class Input {
  render(props) {
    return (
      <root>
        <text
          contentEditable
          suppressContentEditableWarning
          {...props.attributes}
        >
          {props.children}
        </text>
      </root>
    )
  }

  static style = {
    root: {
      borderBottom: [2, 'blue'],
      color: '#777',
      padding: [6, 10],
      fontSize: 16,
    },
    label: {
      width: 100,
      textAlign: 'right',
    },
    text: {},
  }
}
