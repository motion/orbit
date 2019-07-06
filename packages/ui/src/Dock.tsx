import { createStoreContext, useStore } from '@o/use-store'
import { selectDefined } from '@o/utils'
import { gloss, Theme, useTheme } from 'gloss'
import React, { forwardRef, memo, useLayoutEffect, useState } from 'react'
import { Flipped, Flipper } from 'react-flip-toolkit'

import { Arrow } from './Arrow'
import { Button, ButtonProps } from './buttons/Button'
import { createContextualProps } from './helpers/createContextualProps'
import { Tag, TagProps } from './Tag'
import { Row, RowProps } from './View/Row'
import { View } from './View/View'

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

export type DockProps = RowProps

export const Dock = memo(
  forwardRef((props: DockProps, ref) => {
    const dockStore = useStore(DockStore)
    return (
      <DockStoreContext.SimpleProvider value={dockStore}>
        <Flipper flipKey={dockStore.key}>
          <Row ref={ref} position="absolute" bottom={20} right={20} zIndex={100000000} {...props} />
        </Flipper>
      </DockStoreContext.SimpleProvider>
    )
  }),
)

// DockButton

export type DockButtonProps = ButtonProps & {
  label?: string
  labelProps?: Partial<TagLabelProps>
  visible?: boolean
  id: string
}

const DockButtonPropsContext = createContextualProps<DockButtonProps>()
export const DockButtonPassProps = DockButtonPropsContext.PassProps

export function DockButton(props: DockButtonProps) {
  const { visible = true, id, label, labelProps, ...buttonProps } = DockButtonPropsContext.useProps(
    props,
  )
  const dockStore = DockStoreContext.useStore()
  const show = selectDefined(dockStore.items[id], visible)
  const theme = useTheme()

  useLayoutEffect(() => {
    dockStore.next[id] = visible
    dockStore.rerender()
  }, [visible])

  return (
    <Flipped flipId={id}>
      <View flexDirection="row" position="relative" alignItems="center" justifyContent="flex-end">
        <Theme name={theme.background.isDark() ? 'light' : 'dark'}>
          <TagLabel pointerEvents="none" {...labelProps}>
            {props.label}
          </TagLabel>
        </Theme>
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
      </View>
    </Flipped>
  )
}

type TagLabelProps = TagProps & {
  arrowSize?: number
  towards?: 'left' | 'right' | 'top' | 'bottom'
}

const TagLabel = ({
  arrowSize = 12,
  towards = 'right',
  position,
  top,
  left,
  bottom,
  right,
  display,
  background,
  opacity,
  transform,
  transition,
  ...props
}: TagLabelProps) => {
  return (
    <TagLabelChrome
      {...{ position, top, left, bottom, right, display, opacity, transform, transition }}
    >
      <Arrow
        position="absolute"
        top={`calc(50% - ${arrowSize / 2}px)`}
        right={-arrowSize * 2}
        size={arrowSize}
        towards={towards}
        background={background}
      />
      <Tag size="xs" background={background} {...props} />
    </TagLabelChrome>
  )
}

const TagLabelChrome = gloss(View, {
  position: 'relative',
  maxWidth: 'min-content',
})
