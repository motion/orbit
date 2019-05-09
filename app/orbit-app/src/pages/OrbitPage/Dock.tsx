import { createStoreContext, useStore } from '@o/kit'
import { Button, ButtonProps, Row } from '@o/ui'
import React, { memo } from 'react'
import { Flipped, Flipper } from 'react-flip-toolkit'
import { ObservableSet } from 'mobx'

class DockStore {
  items = new ObservableSet<string>()
  add = x => this.items.add(x)
  remove = x => this.items.delete(x)
  get key() {
    return [...this.items].join('')
  }
}

export const DockStoreContext = createStoreContext(DockStore)

// Dock

export const Dock = memo((props: any) => {
  const dockStore = useStore(DockStore)
  return (
    <DockStoreContext.SimpleProvider value={dockStore}>
      <Flipper flipKey={dockStore.key}>
        <Row position="fixed" bottom={20} right={20} zIndex={100000000} {...props} />
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
    dockStore.add(id)
  } else {
    dockStore.remove(id)
  }

  if (!visible) {
    return null
  }

  return (
    <Flipped flipId={id}>
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
          {...props}
        />
      )}
    </Flipped>
  )
}
