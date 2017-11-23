import * as React from 'react'
import * as UI from '@mcro/ui'
import { watch } from '@mcro/black'
import { fuzzy } from '~/helpers'
import { Event, Thing } from '~/app'

export default class MainSidebar {
  get search() {
    return this.props.oraStore.search
  }

  get things() {
    return (
      (this.props.oraStore.items && this.props.oraStore.items.slice(0, 20)) ||
      []
    )
  }

  @watch
  events = () =>
    Event.connected &&
    Event.find()
      .where('created')
      .ne(null)
      .lte(new Date().toISOString())
      .sort({ created: 'desc' })
      .limit(100)

  NAME_MAP = {
    ncammarata: 'nick',
    natew: 'me',
  }

  get items() {
    return [
      ...this.things.map(x => ({ ...Thing.toResult(x), type: 'context' })),
    ]
  }

  get results() {
    const { search } = this
    const items = [
      ...this.items,
      ...(this.events || []).map((item, index) => ({
        children: () => <FeedItem inline event={item} index={index} />,
      })),
    ]
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
            data: { message: 'No results' },
            category: 'Search Results',
          },
        ]
    return searchItems
  }
}
