// @flow
import React from 'react'
import { view } from '@mcro/black'
import Page from './page'
import * as UI from '@mcro/ui'
import InboxList from '~/views/inbox/list'

@view.attach('explorerStore')
@view
export default class InboxPage {
  render({ explorerStore: { document } }) {
    return (
      <UI.Theme name="light">
        <Page>
          <InboxList controlled if={document} document={document} large />
        </Page>
      </UI.Theme>
    )
  }
}
