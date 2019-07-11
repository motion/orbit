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

const defaultProps = {}

export const useActiveSearchQuery = (props: { disabled?: boolean } = defaultProps) => {
  const store = searchStore.useStore(undefined, { react: false })
  const getIsVisible = useGetVisibility()
  const getCurrentQuery = () => {
    const next = getIsVisible() && !props.disabled ? store.query : false
    return next
  }
  return useReaction(
    getCurrentQuery,
    next => {
      ensure('valid', next !== false)
      ensure('visible', getIsVisible())
      return next
    },
    {
      defaultValue: store.query,
    },
    [props.disabled],
  )
}
