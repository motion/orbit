import { AppBit, createUsableStore, openItem, react, SearchState } from '@o/kit'
import { ListItemProps, normalizeItem } from '@o/ui'

import { om } from '../../om/om'
import { SearchStore } from '../../om/SearchStore'
import { appsDrawerStore } from '../../om/stores'
import { appsCarouselStore } from './OrbitAppsCarouselStore'

class OrbitSearchResultsStore {
  searchState: SearchState | null = null

  setSearchState = next => {
    this.searchState = next
  }

  updateSearchResultsStore = react(
    () => this.searchState,
    async (next, { when }) => {
      if (next) {
        await when(() => this.isActive)
        SearchStore.setSearchState(next)
      }
    },
  )

  get isActive() {
    return !appsCarouselStore.zoomedIn && !appsDrawerStore.isOpen
  }

  selectedItem: {
    type: 'app' | 'content'
    index: number
  } = { type: 'app', index: -1 }

  setSelectedItem(item: ListItemProps, index: number) {
    this.selectedItem = {
      type: this.isApp(item) ? 'app' : 'content',
      index,
    }
  }

  get selectedRow() {
    return SearchStore.results[this.selectedItem.index]
  }

  // we can select apps that aren't in the search results
  // so this index may be -1, which is fine and wont break anything
  setSelectedApp = (appId: number) => {
    if (!SearchStore) return
    const index = SearchStore.results.findIndex(x => x.extraData && +x.extraData.id === appId)
    this.selectedItem = {
      type: 'app',
      index,
    }
  }

  isApp(row: ListItemProps) {
    return row && row.extraData && row.extraData.app
  }

  // handlers for actions
  get shouldHandleEnter() {
    if (!this.isActive) return false
    if (!this.selectedRow) return false
    return true
  }

  handleEnter() {
    const row = this.selectedRow
    if (!row) return
    if (this.isApp(row)) {
      appsCarouselStore.zoomIntoCurrentApp()
    } else {
      const item = row.item
      if (!item) return
      const normalized = normalizeItem(item)
      if (normalized.locationLink) {
        openItem(normalized.locationLink)
      } else {
        // we should show a banner here
        console.warn('item doesnt have a location link!')
      }
    }
  }

  get isSelectingContent() {
    if (!this.isActive) return false
    if (!this.selectedRow) return false
    return !this.isApp(this.selectedRow)
  }

  lastSelect = Date.now()

  reactToItem = react(
    () => this.selectedRow,
    async (row, { sleep }) => {
      const timeSinceLastSelect = Date.now() - this.lastSelect
      this.lastSelect = Date.now()
      // set hidden quickly because animations will start in this view
      appsCarouselStore.setHidden(this.selectedItem.type !== 'app')
      if (!row) {
        return
      }
      if (timeSinceLastSelect < 100) {
        await sleep(100)
      }
      if (this.isSelectingContent) {
        // onSelect Bit
        om.actions.setShare({
          id: `app-search-results`,
          value: {
            id: +`${row.id}`,
            name: 'Search Results',
            identifier: 'searchResults',
            items: [row],
          },
        })
      } else {
        if (row.extraData && row.extraData.app) {
          // onSelect App
          const app: AppBit = row.extraData.app
          const carouselIndex = appsCarouselStore.apps.findIndex(x => x.id === app.id)
          if (carouselIndex === -1) return
          appsCarouselStore.animateAndScrollTo(carouselIndex)
        }
      }
    },
    {
      lazy: true,
    },
  )
}
export const orbitSearchResultsStore = createUsableStore(OrbitSearchResultsStore)
window['orbitSearchResultsStore'] = orbitSearchResultsStore
