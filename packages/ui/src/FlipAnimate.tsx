import { createStoreContext, useStore } from '@o/use-store'
import { selectDefined } from '@o/utils'
import React, { memo, useLayoutEffect } from 'react'
import { Flipped, Flipper } from 'react-flip-toolkit'

// lets you do flip animations in any type of deep tree

class FlipAnimateStore {
  key = 0
  items = {}
  next = {}
  rerender = () => {
    this.items = { ...this.next }
    this.key = Math.random()
  }
}

const FlipAnimateStoreContext = createStoreContext(FlipAnimateStore)

export const FlipAnimate = memo((props: { children: any }) => {
  const flipAnimateStore = useStore(FlipAnimateStore)
  return (
    <FlipAnimateStoreContext.SimpleProvider value={flipAnimateStore}>
      <Flipper flipKey={flipAnimateStore.key}>{props.children}</Flipper>
    </FlipAnimateStoreContext.SimpleProvider>
  )
})

// FlipAnimateItem

type FlipAnimateItemProps = {
  visible?: boolean
  id: string
  children: (visible: boolean) => React.ReactNode
}

export const FlipAnimateItem = memo(({ visible = true, id, children }: FlipAnimateItemProps) => {
  const flipAnimateStore = FlipAnimateStoreContext.useStore()
  const cleanId = id.replace(/[^a-z0-9]+/gi, '')
  const show = selectDefined(flipAnimateStore.items[cleanId], visible)

  useLayoutEffect(() => {
    flipAnimateStore.next[cleanId] = visible
    flipAnimateStore.rerender()
  }, [visible])

  return <Flipped flipId={cleanId}>{children(show)}</Flipped>
})
