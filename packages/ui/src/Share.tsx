import { createStoreContext, shallow } from '@o/use-store'

class ShareStore {
  props: {
    onChange?: (location: string, items: any[]) => any
  }

  clipboards = shallow({
    main: [],
  })

  setSelected(location: string | boolean, next: any[]) {
    if (typeof location === 'boolean') {
      location = 'main'
    }
    this.clipboards[location] = next
    if (this.props.onChange) {
      this.props.onChange(location, next)
    }
  }
}

const context = createStoreContext(ShareStore)

export const useShareStore = context.useStore

export const useShareable = (location?: string) => {
  return useShareStore().clipboards[location || 'main']
}

export const useCreateShareStore = context.useCreateStore
export const ProvideShare = context.Provider
