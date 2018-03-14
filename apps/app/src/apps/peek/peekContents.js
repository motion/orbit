// @flow
import * as React from 'react'
import { view } from '@mcro/black'
// import * as UI from '@mcro/ui'
import { App, Electron } from '@mcro/all'

@view
export default class PeekContents {
  render() {
    const peek = Electron.currentPeek
    return (
      <contents>
        got a peek:<br />
        {JSON.stringify(peek)}
        <br />
        selected item:<br />
        {JSON.stringify(App.state.selectedItem || {})}
      </contents>
    )
  }
}
