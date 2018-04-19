import * as React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import { Electron } from '@mcro/all'

@view
export default class PeekHeader {
  render({ icon, title, date, subtitle, after }) {
    const { fullScreen } = Electron.orbitState
    if (!Electron.currentPeek) {
      return null
    }
    // const { isTorn } = Electron.currentPeek
    return (
      <header
        $$draggable={!fullScreen}
        css={{
          padding: title ? [18, 20, 0] : 0,
        }}
      >
        <title if={title}>
          <UI.Title $titleMain size={1.3} fontWeight={700} marginBottom={5}>
            {title}
          </UI.Title>
          <UI.Title if={subtitle} size={1} $subtitle>
            {subtitle} <UI.Date>{date}</UI.Date>
          </UI.Title>
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
      position: 'relative',
      zIndex: 100,
      // borderBottom: [1, [0, 0, 0, 0.05]],
    },
    icon: {
      padding: [0, 5, 0, 18],
    },
    title: {
      flex: 1,
      flexFlow: 'row',
      overflow: 'hidden',
    },
    titleMain: {
      flex: 1,
      marginBottom: 5,
    },
    subtitle: {
      opacity: 0.8,
      marginBottom: 5,
    },
    date: { opacity: 0.5, fontSize: 14 },
    orbitInput: {
      width: '100%',
      // background: 'red',
    },
  }
}
