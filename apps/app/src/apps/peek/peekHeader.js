import * as React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import { App, Electron, Desktop } from '@mcro/all'
import WindowControls from '~/views/windowControls'

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
        <WindowControls
          css={{
            position: 'absolute',
            top: 14,
            ...(Electron.peekOnLeft
              ? {
                  right: 6,
                }
              : {
                  left: 6,
                }),
          }}
          onClose={() => {
            App.setPeekTarget(null)
          }}
        />
        <title if={title}>
          <titlemain>
            <UI.Title size={1.8} fontWeight={700} marginBottom={5}>
              {title}
            </UI.Title>
            <UI.Title if={subtitle} size={1}>
              {subtitle}
            </UI.Title>
            <UI.Date css={{ opacity: 0.5 }}>{date}</UI.Date>
          </titlemain>
          <UI.Icon $icon color="#ddd" if={icon} name={icon} size={16} />
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
    titlemain: {
      flex: 1,
    },
    orbitInput: {
      width: '100%',
      // background: 'red',
    },
  }
}
