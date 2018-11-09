import * as React from 'react'
import { AppWrapper } from '../../views'
import { MenuLayer } from './menuLayer/MenuLayer'
import { Theme } from '@mcro/ui'
import { App } from '@mcro/stores'
import { useStore } from '@mcro/use-store'

class ChromePageStore {
  get theme() {
    return App.state.darkTheme ? 'clearDark' : 'clearLight'
  }
}

export function ChromePage() {
  const store = useStore(ChromePageStore)
  console.log('nreder chore asdasda.......')
  return (
    <Theme name={store.theme}>
      <AppWrapper>
        <MenuLayer />
      </AppWrapper>
    </Theme>
  )
}
