import { view } from 'helpers'
import Router from 'router'
import TimeAgo from 'react-timeago'
import { Page } from 'views'
import Document from '~/src/views/doc'

@view
export default class DocSinglePage {
  render() {
    return (
      <Page>
        <Page.Main $page>
          <Document id={Router.params.id.replace('-', ':')} />
        </Page.Main>
      </Page>
    )
  }

  static style = {
    page: {
      maxWidth: 700,
      margin: '30px auto',
    },
  }
}
