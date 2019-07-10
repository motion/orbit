import { createStoreContext, ensure, react, useReaction } from '@o/use-store'

import { useGetVisibility } from './Visibility'

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

export const useActiveSearchQuery = () => {
  const store = searchStore.useStore(undefined, { react: false })
  const getVisibility = useGetVisibility()
  return useReaction(
    () => {
      ensure('visible', getVisibility())
      return store.query
    },
    {
      defaultValue: store.query,
    },
  )
}
