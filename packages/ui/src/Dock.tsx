import { createStoreContext, useStore } from '@o/use-store'
import { selectDefined } from '@o/utils'
import React, { forwardRef, memo, useLayoutEffect } from 'react'
import { Flipped, Flipper } from 'react-flip-toolkit'

import { Button, ButtonProps } from './buttons/Button'
import { createContextualProps } from './helpers/createContextualProps'
import { Col } from './View/Col'
import { Row, RowProps } from './View/Row'

class DockStore {
  key = 0
  items = {}
  next = {}
  rerender = () => {
    this.items = { ...this.next }
    this.key = Math.random()
  }
}

export const DockStoreContext = createStoreContext(DockStore)

// Dock

export type DockProps = RowProps & {
  direction?: 'row' | 'column'
}

export const Dock = memo(
  forwardRef((props: DockProps, ref) => {
    const dockStore = useStore(DockStore)
    const DockView = props.direction === 'row' ? Row : Col
    return (
      <DockStoreContext.SimpleProvider value={dockStore}>
        <Flipper flipKey={dockStore.key}>
          <DockView
            ref={ref}
            position="absolute"
            bottom={20}
            right={20}
            zIndex={100000000}
            {...props}
          />
        </Flipper>
      </DockStoreContext.SimpleProvider>
    )
  }),
)

// DockButton

export type DockButtonProps = ButtonProps & {
  visible?: boolean
  id: string
}

const DockButtonPropsContext = createContextualProps<DockButtonProps>()
export const DockButtonPassProps = DockButtonPropsContext.PassProps

export function DockButton(props: DockButtonProps) {
  const { visible = true, id, ...buttonProps } = DockButtonPropsContext.useProps(props)
  const dockStore = DockStoreContext.useStore()
  const show = selectDefined(dockStore.items[id], visible)

  useLayoutEffect(() => {
    dockStore.next[id] = visible
    dockStore.rerender()
  }, [visible])

  return (
    <Flipped flipId={id}>
      <Button
        size="xl"
        width={42}
        height={42}
        marginLeft={15}
        circular
        iconSize={18}
        elevation={4}
        badgeProps={{
          background: '#333',
        }}
        zIndex={100000000}
        opacity={1}
        {...!show && { marginRight: -(50 + 15), opacity: 0 }}
        {...buttonProps}
      />
    </Flipped>
  )
}
