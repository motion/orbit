import { view } from '~/helpers'
import { Page, Button } from '~/views'
import Router from '~/router'
import Editor from '~/views/editor'

@view
export default class Document {
  render({ document }) {
    return <Editor doc={document} id={document._id} />
  }
}
