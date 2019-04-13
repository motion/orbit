import { createStoreContext } from '@o/kit'
import { Theme, View } from '@o/ui'
import React, { useEffect } from 'react'

class SiteStore {
  theme = 'light'

  windowHeight = window.innerHeight

  setTheme = (name: string) => {
    this.theme = name
  }

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

export function Body(props: any) {
  const siteStore = useCreateStore()

  console.log('siteStore', siteStore)
  useEffect(() => {
    window.addEventListener('resize', () => {
      siteStore.windowHeight = window.innerHeight
    })
  })

  return (
    <Theme name={siteStore.theme}>
      <SimpleProvider value={siteStore}>
        <View background={bg} transition="all ease 500ms">
          {props.children}
        </View>
      </SimpleProvider>
    </Theme>
  )
}

const bg = theme => theme.background
