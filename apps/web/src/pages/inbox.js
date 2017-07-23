// @flow
import React from 'react'
import { view } from '@mcro/black'
import Page from './page'
import InboxList from '~/views/inbox/list'

@view.attach('rootStore')
@view
export default class InboxPage {
  render({ rootStore: { document } }) {
    return (
      <Page>
        <InboxList if={document} document={document} large />
      </Page>
    )
  }
}
