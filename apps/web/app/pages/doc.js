import { view } from '~/helpers'
import Router from '~/router'
import TimeAgo from 'react-timeago'
import { Page } from '~/views'
import DocumentPage from '~/views/document/page'

@view
export default class DocSinglePage {
  render() {
    return <DocumentPage id={Router.params.id.replace('-', ':')} />
  }

  static style = {
    page: {
      maxWidth: 700,
      margin: '30px auto',
    },
  }
}
