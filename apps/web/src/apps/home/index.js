import * as React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import HomeStore from './homeStore'
import Main from './main'
import Sidebar from './sidebar'

const inputStyle = {
  fontWeight: 200,
  color: '#fff',
  fontSize: 30,
}

@view.provide({
  homeStore: HomeStore,
})
@view
export default class HomePage {
  render({ homeStore }) {
    return (
      <UI.Theme name="clear-dark">
        <bar ref={homeStore.ref('barRef').set} $$fullscreen>
          <header $$draggable>
            <UI.Icon
              $searchIcon
              size={18}
              name="zoom"
              color={[255, 255, 255, 0.1]}
            />
            <UI.Input
              $searchInput
              onClick={homeStore.onClickInput}
              size={1.8}
              getRef={homeStore.onInputRef}
              borderRadius={0}
              onChange={homeStore.onSearchChange}
              value={homeStore.textboxVal}
              borderWidth={0}
              fontWeight={200}
              css={inputStyle}
            />
            <forwardcomplete>
              <fwdcontents>{homeStore.peekItem}</fwdcontents>
            </forwardcomplete>
          </header>

          <Sidebar homeStore={homeStore} />
          <Main homeStore={homeStore} />
        </bar>
      </UI.Theme>
    )
  }

  static style = {
    bar: {
      background: [135, 135, 135, 0.6],
      flex: 1,
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
