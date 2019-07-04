import { createStoreContext, react } from '@o/use-store'

/**
 * TODO we should rename this to HighlightQueryStore likely and keep it specific
 */

class UISearchStore {
  props: {
    query: string
  }

  query = ''

  updateOnProps = react(
    () => this.props.query,
    next => {
      this.query = next
    },
  )

  setQuery = (next: string) => {
    this.query = next
  }
}

const searchStore = createStoreContext(UISearchStore)

export const useSearch = searchStore.useStore
export const useCreateSearch = searchStore.useCreateStore
export const ProvideSearch = searchStore.Provider
