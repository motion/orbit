// @flow
import React from 'react'
import { view } from '@mcro/black'
import Page from '~/views/page'
import InboxList from '~/views/inbox/list'

@view.attach('explorerStore')
@view
export default class InboxPage {
  render({ explorerStore: { document } }) {
    return (
      <Page>
        <InboxList if={document} document={document} />
      </Page>
    )
  }
}
