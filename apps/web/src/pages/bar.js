// @flow
import React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'

// import DocumentView from '~/views/document'
// <DocumentView document={document} isPrimaryDocument />

class BarStore {}

@view.attach('rootStore')
@view({
  store: BarStore,
})
export default class BarPage {
  render({ rootStore }) {
    return (
      <bar>
        <UI.Input size={3} />
      </bar>
    )
  }

  static style = {
    bar: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      transform: {
        z: 0,
      },
      background: 'rgba(255, 255, 255, 0.75)',
    },
  }
}
