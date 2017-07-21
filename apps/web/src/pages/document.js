// @flow
import React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import Page from './page'
import DocumentView from '~/views/document'

@view.attach('explorerStore')
@view
export default class DocumentPage {
  render({ explorerStore: { document } }) {
    // this is the "loading" state
    if (document === undefined) {
      return null
    }

    if (!document) {
      return (
        <UI.Placeholder $$margin="auto" size={2}>
          Doc 404
        </UI.Placeholder>
      )
    }

    return (
      <Page>
        <DocumentView
          showActions
          showChildren
          document={document}
          isPrimaryDocument
        />
      </Page>
    )
  }
}
