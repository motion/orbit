import { view } from '~/helpers'
import { Page, Button } from '~/views'
import Router from '~/router'
import Editor from '~/views/editor'

@view
export default class Document {
  downAt = Date.now()
  editor = null

  mousedown = () => (this.downAt = Date.now())
  mouseup = () => {
    if (Date.now() - this.downAt < 100) {
      this.editor.focus()
    }
  }

  render({ document, focusOnMount, editorProps, ...props }) {
    return (
      <doc {...props} onMouseDown={this.mousedown} onMouseUp={this.mouseup}>
        <Editor
          focusOnMount
          getRef={this.ref('editor').set}
          doc={document}
          id={document._id}
          {...editorProps}
        />
      </doc>
    )
  }

  static style = {
    doc: {
      padding: [5, 20],
      flex: 1,
    },
  }
}
