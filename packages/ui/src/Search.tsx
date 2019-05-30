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

const context = createStoreContext(SearchStore)

export const useSearch = context.useStore
export const useCreateSearch = context.useCreateStore
export const ProvideSearch = context.Provider
