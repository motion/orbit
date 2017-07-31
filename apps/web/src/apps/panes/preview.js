import { view } from '@mcro/black'
import DocumentView from '~/views/document'

@view
export default class BarPreviewPane {
  render({ activeItem }) {
    console.log('preview', activeItem)
    return <DocumentView document={activeItem} />
  }
}
