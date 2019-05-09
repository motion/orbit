import { createStoreContext, useStore } from '@o/kit'
import { Button, ButtonProps, Row } from '@o/ui'
import React, { memo, useLayoutEffect, useState } from 'react'
import { Flipped, Flipper } from 'react-flip-toolkit'
import { ObservableSet } from 'mobx'

class DockStore {
  items = new ObservableSet<string>()
  add = x => this.items.add(x)
  remove = x => this.items.delete(x)
  get key() {
    console.log('ok')
    return [...this.items].join('')
  }
}

export const DockStoreContext = createStoreContext(DockStore)

// Dock

export const Dock = memo((props: any) => {
  const dockStore = useStore(DockStore)
  const [now, setNow] = useState()

  console.log('render', dockStore.key)

  return (
    <DockStoreContext.SimpleProvider value={dockStore}>
      <Button onClick={() => setNow(!now)}>toggle</Button>
      <Flipper flipKey={`${now}` || dockStore.key}>
        <Row position="fixed" bottom={20} right={20} zIndex={100000000} {...props}>
          <Flipped flipId={'1'}>
            <Button
              background={now ? 'green' : 'red'}
              opacity={now ? 0 : 1}
              width={now ? 0 : 'auto'}
            >
              hihi
            </Button>
          </Flipped>
          <Button>hihi</Button>
          <Flipped flipId={'2'}>
            <Button
              background={now ? 'green' : 'red'}
              opacity={now ? 0 : 1}
              width={now ? 0 : 'auto'}
            >
              hihi
            </Button>
          </Flipped>
        </Row>
      </Flipper>
    </DockStoreContext.SimpleProvider>
  )
})

// DockButton

type DockButtonProps = ButtonProps & {
  visible?: boolean
  id: string
}

const dur = 200

export function DockButton({ visible = true, id, ...buttonProps }: DockButtonProps) {
  const dockStore = DockStoreContext.useStore()

  if (visible) {
    console.log('add', id)
    dockStore.add(id)
  } else {
    dockStore.remove(id)
  }

  console.log('finish render', dockStore.key, id, visible)

  if (!visible) {
    return null
  }

  return (
    <Flipped onAppear={onElementAppear} onExit={onExit} flipId={id}>
      {props => (
        <Button
          circular
          size="xxl"
          iconSize={16}
          elevation={4}
          marginLeft={20}
          badgeProps={{
            background: '#333',
          }}
          zIndex={100000000}
          transition={`all ease ${dur}ms`}
          opacity={visible ? 1 : 0}
          transform={{
            y: visible ? 0 : 150,
          }}
          {...buttonProps}
          {...log(props)}
        />
      )}
    </Flipped>
  )
}
