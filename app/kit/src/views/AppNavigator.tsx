import { AppViewProps } from '@o/models'
import { CardStack } from '@o/ui'
import { createStoreContext } from '@o/use-store'
import React, { Children, FunctionComponent, memo, useEffect, useMemo, useState } from 'react'

import { App } from './App'

export type NavigatorProps = AppViewProps & {
  selectItems: (items?: any[]) => void
  navigateTo: (name: string, props?: any) => void
}

export type AppNavigatorProps = {
  index: FunctionComponent<NavigatorProps>
  detail: FunctionComponent<NavigatorProps>
}

export const AppNavigator = memo((props: AppNavigatorProps) => {
  const appChildViews = AppChildViews.useCreateStore()
  const IndexView = props.index
  const DetailView = props.detail
  const [items, setItems] = useState([])

  const navigatorProps = useMemo(
    () => ({
      navigateTo: (name, props) => {
        console.log('todo', name, props)
      },
      selectItems: next => {
        setItems(next)
      },
    }),
    [],
  )

  return (
    <AppChildViews.ProvideStore value={appChildViews}>
      <App
        statusBar={appChildViews.statusBar}
        toolBar={appChildViews.toolBar}
        index={<IndexView {...navigatorProps} />}
      >
        <CardStack showSinglePlain>
          {items.map(item => (
            <DetailView key={item.id} {...navigatorProps} {...item} />
          ))}
        </CardStack>
      </App>
    </AppChildViews.ProvideStore>
  )
})

AppNavigator['isApp'] = true

class AppChildViewsStore {
  statusBar = null
  toolBar = null
  setItems(next: { statusBar?: React.ReactNode; toolBar?: React.ReactNode }) {
    this.statusBar = next.statusBar || this.statusBar || null
    this.toolBar = next.toolBar || this.toolBar || null
  }
}

export const AppChildViews = createStoreContext(AppChildViewsStore)
