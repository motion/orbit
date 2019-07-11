import { AppViewProps } from '@o/models'
import { createStoreContext } from '@o/use-store'
import React, { FunctionComponent, memo, useMemo, useState } from 'react'

import { App } from './App'

export type NavigatorProps = {
  selectItems: (items?: any[]) => void
  navigateTo: (name: string, props?: any) => void
}

export type AppNavigatorProps = {
  index: FunctionComponent<NavigatorProps>
  detail: FunctionComponent<NavigatorProps & AppViewProps>
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
      selectItems: setItems,
    }),
    [],
  )

  return (
    <AppChildViews.SimpleProvider value={appChildViews}>
      <App
        statusBar={appChildViews.statusBar}
        toolBar={appChildViews.toolBar}
        index={<IndexView {...navigatorProps} />}
      >
        <CardStack>
          {items.map((item, index) => (
            <DetailView key={index} {...navigatorProps} {...item} />
          ))}
        </CardStack>
      </App>
    </AppChildViews.SimpleProvider>
  )
})

AppNavigator['isApp'] = true

class AppChildViewsStore {
  statusBar = null
  toolBar = null

  setItems(next: { statusBar?: React.ReactNode; toolBar?: React.ReactNode }) {
    this.statusBar = next.statusBar || this.statusBar
    this.toolBar = next.toolBar || this.toolBar
  }
}

export const AppChildViews = createStoreContext(AppChildViewsStore)

// TODO move into UI
const CardStack = props => {
  return props.children
}
