import { createStoreContext, react } from '@o/use-store'

class SearchStore {
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

export const searchStore = createStoreContext(SearchStore)
export const useSearch = searchStore.useStore
export const useCreateSearch = searchStore.useCreateStore
export const ProvideSearch = searchStore.Provider
