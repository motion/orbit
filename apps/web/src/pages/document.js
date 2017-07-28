// @flow
import React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import Page from './page'
import DocumentView from '~/views/document'
import Children from './page/children'

@view.attach('rootStore')
@view
export default class DocumentPage {
  componentWillMount() {
    log('willmount document page')
  }

  render({ rootStore: { document } }) {
    log('render', document)
    // this is the "loading" state
    if (document === undefined) {
      return <hi>hi</hi>
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
