// @flow
import React from 'react'
import { view } from '~/helpers'
import { Icon } from '~/ui'
import Editor from '~/views/editor'

@view
export default class Document {
  downAt = Date.now()
  editor = null

  mousedown = () => {
    this.downAt = Date.now()
  }

  mouseup = (e: Event) => {
    const isDirectClick = e.target === e.currentTarget
    const isShortClick = Date.now() - this.downAt < 200
    if (isDirectClick && isShortClick) {
      this.editor.focus()
    }
  }

  render({ document, focusOnMount, ...props }) {
    return (
      <docview onMouseDown={this.mousedown} onMouseUp={this.mouseup}>
        <document>
          <Editor
            getRef={this.ref('editor').set}
            doc={document}
            id={document._id}
            {...props}
          />
        </document>

        <sidebar if={false}>
          <Icon name="camera" />
        </sidebar>
      </docview>
    )
  }

  static style = {
    docview: {
      flex: 1,
      flexFlow: 'row',
    },
    document: {
      padding: [8, 0],
      width: '100%',
    },
    sidebar: {
      width: 40,
      // borderLeft: [1, '#eee'],
      alignItems: 'center',
      justifyContent: 'center',
    },
  }
}
