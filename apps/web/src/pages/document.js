// @flow
import React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import Page from './page'
import DocumentView from '~/views/document'

@view
class FakeDocument {
  render() {
    return (
      <Page>
        <fakedoc
          css={{
            padding: 20,
          }}
        >
          <fakeTitle
            css={{
              width: 120,
              height: 28,
              background: '#f5f5f5',
            }}
          />
        </fakedoc>
      </Page>
    )
  }
}

@view.attach('rootStore')
@view
export default class DocumentPage {
  render({ rootStore: { document } }) {
    // this is the "loading" state
    if (document === undefined) {
      return <FakeDocument />
    }

    if (!document) {
      return (
        <UI.Placeholder $$margin="auto" size={2}>
          Doc 404
        </UI.Placeholder>
      )
    }

    // TODO hi nick
    // return (
    //   <Page>
    //     <div $$row>
    //       <div $$width={300}>
    //         <Children alignLeft size={2} document={document} />
    //       </div>
    //       <div $$width={200}>
    //         <Children alignLeft document={document} />
    //       </div>
    //     </div>
    //   </Page>
    // )

    return (
      <Page showActions showChildren>
        <DocumentView document={document} isPrimaryDocument />
      </Page>
    )
  }
}
