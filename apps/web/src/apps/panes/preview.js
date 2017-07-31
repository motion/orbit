import DocumentView from '~/views/document'

export default class BarPreviewPane {
  render({ activeItem }) {
    return <DocumentView document={activeItem} />
  }
}
