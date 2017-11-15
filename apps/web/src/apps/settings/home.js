import * as React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import OraStore from './oraStore'
import Main from '~/apps/panes/main'
import Sidebar from '~/apps/panes/sidebar'

const inputStyle = {
  fontWeight: 200,
  color: '#fff',
  fontSize: 30,
}

@view.provide({
  oraStore: OraStore,
})
@view
export default class HomePage {
  render({ oraStore }) {
    return (
      <UI.Theme name="clear-dark">
        <home ref={oraStore.ref('barRef').set} $$fullscreen>
          <header $$draggable>
            <UI.Icon
              $searchIcon
              size={18}
              name="zoom"
              color={[255, 255, 255, 0.1]}
            />
            <UI.Input
              $searchInput
              onClick={oraStore.onClickInput}
              size={1.8}
              getRef={oraStore.onInputRef}
              borderRadius={0}
              onChange={oraStore.onSearchChange}
              value={oraStore.textboxVal}
              borderWidth={0}
              fontWeight={200}
              css={inputStyle}
            />
          </header>
          <content>
            <Sidebar store={oraStore} oraStore={oraStore} />
            <Main store={oraStore} />
          </content>
        </home>
      </UI.Theme>
    )
  }

  static style = {
    home: {
      background: [200, 200, 200, 0.45],
      flex: 1,
    },
    content: {
      flexFlow: 'row',
      flex: 1,
      position: 'relative',
    },
    header: {
      position: 'relative',
      height: 70,
      marginTop: -1,
    },
    searchIcon: {
      position: 'absolute',
      top: 3,
      bottom: 0,
      alignItems: 'center',
      height: 'auto',
      left: 18,
    },
    searchInput: {
      padding: [0, 20, 0, 50],
    },
    forwardcomplete: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      alignItems: 'center',
      justifyContent: 'center',
      left: 50,
      opacity: 0,
      ...inputStyle,
      zIndex: -1,
      pointerEvents: 'none',
    },
    fwdcontents: {
      marginTop: 1,
    },
  }
}
