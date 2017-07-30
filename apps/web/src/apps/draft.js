import React from 'react'
import { view } from '@mcro/black'
import Page from './page'
import Draft from '~/views/inbox/draft'

@view.attach('rootStore')
@view
export default class DraftPage {
  render({ rootStore }) {
    log('render draft page')
    if (!rootStore.document) {
      return <null>not found</null>
    }

    return (
      <Page>
        <Draft parentId={rootStore.document.id} />
      </Page>
    )
  }
}
