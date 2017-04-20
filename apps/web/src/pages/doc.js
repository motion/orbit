import { view } from 'helpers'
import Router from 'router'
import TimeAgo from 'react-timeago'
import { Page } from 'views'
import Document from '~/src/views/doc/document'

@view
export default class DocSinglePage {
  render() {
    return <Document id={Router.params.id.replace('-', ':')} />
  }

  static style = {
    page: {
      maxWidth: 700,
      margin: '30px auto',
    },
  }
}
