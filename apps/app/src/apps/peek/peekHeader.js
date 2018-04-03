import * as React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import ControlButton from '~/views/controlButton'
import { Electron } from '@mcro/all'

@view
export default class PeekHeader {
  render({ icon, title, date, subtitle, after }) {
    const { fullScreen } = Electron.orbitState
    if (!Electron.currentPeek) {
      return null
    }
    const { isTorn } = Electron.currentPeek
    return (
      <header $$draggable={!fullScreen}>
        <buttons if={isTorn} $$row css={{ marginRight: 14 }}>
          <ControlButton icon="x" />
          <ControlButton icon="y" background="#F6BE4F" />
          <ControlButton icon="z" background="#62C554" />
        </buttons>
        <title if={title}>
          <UI.Icon $icon color="#ccc" if={icon} name={icon} />
          <titlemain>
            <UI.Title size={1.3} marginBottom={5}>
              {title}
            </UI.Title>
            <UI.Title if={subtitle} size={1}>
              {subtitle}
            </UI.Title>
            <UI.Date css={{ opacity: 0.5 }}>{date}</UI.Date>
          </titlemain>
        </title>
        <after if={after}>{after}</after>
      </header>
    )
  }

  static style = {
    header: {
      flexFlow: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      padding: [20, 20],
      borderBottom: [1, [0, 0, 0, 0.05]],
    },
    icon: {
      padding: [0, 20, 0, 0],
    },
    title: {
      flex: 1,
      flexFlow: 'row',
      overflow: 'hidden',
    },
    titlemain: {
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
