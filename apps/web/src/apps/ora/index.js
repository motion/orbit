import * as React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import OraStore from './oraStore'
import Sidebar from '../home/sidebar'
import { fuzzy } from '~/helpers'

const sidebars = {
  oramain: class OraMain {
    get search() {
      return this.props.homeStore.search
    }

    items = [{ title: 'test', icon: 'poo' }]

    get results() {
      const search = fuzzy(this.items, this.search)
      if (!search.length) {
        return [
          {
            type: 'message',
            title: 'No Results...',
            data: { message: 'No results' },
            category: 'Search Results',
          },
        ]
      }
      return search
    }
  },
}

const inputStyle = {
  fontWeight: 300,
  color: '#fff',
  fontSize: 20,
}

@view.provide({
  homeStore: OraStore,
})
@view
export default class HomePage {
  render({ homeStore }) {
    return (
      <UI.Theme name="clear-dark">
        <home ref={homeStore.ref('barRef').set} $$fullscreen $$draggable>
          <header $$draggable>
            <UI.Icon
              $searchIcon
              size={16}
              name="zoom"
              color={[255, 255, 255, 1]}
            />
            <UI.Input
              $searchInput
              onClick={homeStore.onClickInput}
              size={1}
              getRef={homeStore.onInputRef}
              borderRadius={0}
              onChange={homeStore.onSearchChange}
              value={homeStore.textboxVal}
              borderWidth={0}
              fontWeight={200}
              css={inputStyle}
            />
          </header>
          <content>
            <Sidebar sidebars={sidebars} homeStore={homeStore} />
          </content>
        </home>
      </UI.Theme>
    )
  }

  static style = {
    home: {
      // background: [20, 20, 20, 0.93],
      // borderRadius: 12,
      overflow: 'hidden',
    },
    content: {
      flex: 1,
      position: 'relative',
    },
    header: {
      position: 'relative',
    },
    searchIcon: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      alignItems: 'center',
      height: 'auto',
      left: 12,
    },
    searchInput: {
      position: 'relative',
      padding: [10, 25],
      paddingLeft: 36,
      borderBottom: [1, 'dotted', [255, 255, 255, 0.1]],
    },
  }
}
