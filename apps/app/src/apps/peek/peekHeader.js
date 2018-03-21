// @flow
import * as React from 'react'
import { view } from '@mcro/black'
// import * as UI from '@mcro/ui'
import ControlButton from '~/views/controlButton'
import { Electron } from '@mcro/all'

@view
export default class PeekHeader {
  render() {
    const { fullScreen } = Electron.orbitState
    const { isTorn } = Electron.currentPeek
    return (
      <header $$draggable={!fullScreen}>
        <buttons if={isTorn} $$row css={{ marginRight: 14 }}>
          <ControlButton icon="x" />
          <ControlButton icon="y" background="#F6BE4F" />
          <ControlButton icon="z" background="#62C554" />
        </buttons>
        <title>title</title>
      </header>
    )
  }

  static style = {
    header: {
      flexFlow: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      padding: [10, 10],
    },
    title: {
      flex: 1,
    },
    controls: {
      padding: [0, 0, 0, 10],
    },
    orbitInput: {
      width: '100%',
      // background: 'red',
    },
  }
}
