import { createStoreContext, useReaction } from '@o/use-store'
import { selectDefined } from '@o/utils'
import { useContext } from 'react'

export class VisibilityStore {
  props: { visible: boolean }

  get visible() {
    return this.props.visible
  }
}

const Vis = createStoreContext(VisibilityStore)

export const VisibilityContext = Vis.Context
export const ProvideVisibility = Vis.Provider
export const useVisibilityStore = () => useContext(Vis.Context) || { visible: true }

export function useVisibility(props?: { onChange: (visibility: boolean) => any }) {
  // may not be provided
  try {
    const onChange = props && props.onChange
    const react = !onChange
    const store = Vis.useStore({ react })

    if (onChange) {
      useReaction(() => store.visible, props.onChange, {
        avoidRender: true,
      })
    }

    return selectDefined(store.visible, true)
  } catch {
    // no visibility store
    return true
  }
}

// if you want to avoid re-rendering on updates
export function useGetVisibility() {
  // support may not be provided
  try {
    const store = Vis.useStore({ react: false })
    return () => store.visible
  } catch {
    // no visibility store
    return () => true
  }
}
