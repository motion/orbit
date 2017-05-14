import { view } from '~/helpers'
import { Button, Icon } from '~/ui'
import Router from '~/router'
import Editor from '~/views/editor'

@view
export default class Document {
  downAt = Date.now()
  editor = null

  mousedown = () => {
    this.downAt = Date.now()
  }

  mouseup = () => {
    if (Date.now() - this.downAt < 200) {
      this.editor.focus()
    }
  }

  render({ document, focusOnMount, ...props }) {
    return (
      <docview onMouseDown={this.mousedown} onMouseUp={this.mouseup}>
        <document>
          <Editor
            focusOnMount
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
      padding: [5, 18],
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
