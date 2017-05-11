import { view } from '~/helpers'
import { Page, Button } from '~/views'
import Router from '~/router'
import Editor from '~/views/editor'

@view
export default class Document {
  render({ document, focusOnMount }) {
    return (
      <doc>
        <Editor focusOnMount doc={document} id={document._id} />
      </doc>
    )
  }

  static style = {
    doc: {
      padding: [5, 20],
    },
  }
}
