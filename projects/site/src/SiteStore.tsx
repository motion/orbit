import { createStoreContext } from '@o/kit'
import React from 'react'

class SiteStore {
  windowHeight = window.innerHeight
  get sectionHeight() {
    return Math.min(
      // min-height
      Math.max(800, this.windowHeight),
      // max-height
      1000,
    )
  }
}

const { SimpleProvider, useStore, useCreateStore } = createStoreContext(SiteStore)

export const useSiteStore = useStore

export const ProvideSiteStore = React.memo((props: { children: any }) => {
  const siteStore = useCreateStore()

  React.useEffect(() => {
    window.addEventListener('resize', () => {
      siteStore.windowHeight = window.innerHeight
    })
  })

  return <SimpleProvider value={siteStore}>{props.children}</SimpleProvider>
})
