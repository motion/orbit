// import * as React from 'react'
import * as UI from '@mcro/ui'
import { fuzzy } from '~/helpers'
import { Thing } from '~/app'
import SidebarTitle from '~/views/sidebarTitle'

export default class MainSidebar {
  get search() {
    return this.props.oraStore.search
  }

  get things() {
    return this.props.oraStore.items || []
  }

  NAME_MAP = {
    ncammarata: 'nick',
    natew: 'me',
  }

  get items() {
    if (this.things.length) {
      return [
        ...this.things.map(x => ({ ...Thing.toResult(x), type: 'context' })),
      ]
    }
    return [
      {
        type: 'message',
        title: 'Welcome to Orbit',
      },
    ]
  }

  get title() {
    return {
      title: 'Home',
      after: (
        <UI.Icon
          name="gear"
          onClick={this.props.oraStore.actions.openSettings}
        />
      ),
    }
  }

  get results() {
    const { search } = this
    const items = [...this.items]
    if (!search) {
      return items
    }
    const filteredSearch = fuzzy(this.items, search)
    const searchItems = filteredSearch.length
      ? filteredSearch
      : [
          {
            type: 'message',
            title: 'No Results...',
            category: 'Search Results',
          },
        ]
    return searchItems
  }
}
