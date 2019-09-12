import { createStoreContext, shallow } from '@o/use-store'
import { useCallback } from 'react'

import { filterCleanObject } from './helpers/filterCleanObject'

class ShareStore {
  props: {
    onChange?: (location: string, items: any[]) => any
    id?: string
  }

  get id() {
    return this.props.id
  }

  clipboards = shallow({
    main: [],
  })

  setSelected(location: string | boolean, raw: any[]) {
    if (typeof location === 'boolean') {
      location = 'main'
    }
    const next = filterCleanObject(raw)
    this.clipboards[location] = next
    if (this.props.onChange) {
      this.props.onChange(location, next)
    }
  }
}

const context = createStoreContext(ShareStore)

export const useShareStore = context.useStore

export const useShare = <A extends any[]>(location?: string): [A, (next: A) => void] => {
  const store = useShareStore()
  const value = store.clipboards[location || 'main']
  const update = useCallback(next => store.setSelected(location || 'main', next), [store, location])
  return [value, update]
}

export const useSetShare = (location?: string): ((next: any[]) => void) => {
  const store = useShareStore({ react: false })
  const update = useCallback(next => store.setSelected(location || 'main', next), [store, location])
  return update
}

export const useCreateShareStore = context.useCreateStore
export const ProvideShare = context.Provider
