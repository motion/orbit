import { AppViewProps } from '@o/models'
import { Card } from '@o/ui'
import { createStoreContext } from '@o/use-store'
import React, { Children, FunctionComponent, memo, useMemo, useState } from 'react'

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
        console.log('selecting imtes', next)
        setItems(next)
      },
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
    this.statusBar = next.statusBar || this.statusBar || null
    this.toolBar = next.toolBar || this.toolBar || null
  }
}

export const AppChildViews = createStoreContext(AppChildViewsStore)

// TODO move into UI
const CardStack = props => {
  const all = Children.toArray(props.children)
  const [focused, setFocused] = useState(-1)

  if (all.length <= 1) {
    return all
  }

  return (
    <>
      {all.map((item, index) => (
        <Card
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          elevation={4}
          {...cardPositionalProps(index, all.length)}
          key={item.id || index}
        >
          {item}
        </Card>
      ))}
    </>
  )
}

const cardPositionalProps = (index: number, total: number) => {
  const mid = Math.round(total / 2)
  const distanceFromMid = index - mid
  return {
    transform: {
      scale: 0.8,
      x: distanceFromMid * 10,
      rotate: `${distanceFromMid * 2.5}deg`,
    },
  }
}
