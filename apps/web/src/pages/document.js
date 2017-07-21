// @flow
import React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import Page from './page'
import DocumentView from '~/views/document'
import Children from '~/views/document/children'
import Actions from '~/views/document/actions'

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
        <docpagecontent id="content">
          <DocumentView $doc document={document} isPrimaryDocument />
          <sidebar>
            <Actions />
            <Children />
          </sidebar>
        </docpagecontent>
      </Page>
    )
  }

  static style = {
    docpagecontent: {
      flex: 1,
      overflow: 'hidden',
      zIndex: 20,
      overflowY: 'scroll',
      position: 'relative',
    },
    sidebar: {
      width: 135,
      position: 'absolute',
      overflow: 'hidden',
      zIndex: 50,
      top: 0,
      right: 0,
      pointerEvents: 'none',
    },
    doc: {
      paddingRight: 140,
    },
  }
}
