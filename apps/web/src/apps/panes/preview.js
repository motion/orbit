import DocumentView from '~/views/document'
import { User } from '~/app'

export default class BarPreviewPane {
  render() {
    return <DocumentView document={User.home} />
  }
}
