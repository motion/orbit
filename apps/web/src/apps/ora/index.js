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

    items = []

    get results() {
      const { contextResults, osContext } = this.props.homeStore
      const search = fuzzy(this.items, this.search)
      const searchItems = search.length
        ? search
        : [
            {
              type: 'message',
              title: 'No Results...',
              data: { message: 'No results' },
              category: 'Search Results',
            },
          ]

      const context =
        osContext && osContext.show
          ? contextResults
          : [
              {
                type: 'message',
                title: 'Load a github issue',
              },
            ]

      return context // searchItems.concat(contextResults)
      // return [...searchItems, ...this.props.homeStore.context]
    }
  },
}

const inputStyle = {
  fontWeight: 200,
  color: '#fff',
  fontSize: 30,
}

@view.provide({
  homeStore: OraStore,
})
@view
export default class HomePage {
  render({ homeStore }) {
    return (
      <UI.Theme name="clear-dark">
        <home ref={homeStore.ref('barRef').set} $$fullscreen>
          <header $$draggable>
            <UI.Icon
              $searchIcon
              size={16}
              name="zoom"
              color={[255, 255, 255, 0.1]}
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
      padding: [0, 15, 0, 30],
    },
  }
}
