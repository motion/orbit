import { createStoreContext, useStore } from '@o/use-store'
import { selectDefined } from '@o/utils'
import { gloss, Theme } from 'gloss'
import React, { memo, useLayoutEffect, useState } from 'react'

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

export const Dock = memo((props: DockProps) => {
  const dockStore = useStore(DockStore)
  return (
    <DockStoreContext.ProvideStore value={dockStore}>
      <Row position="absolute" bottom={20} right={20} zIndex={100000000} {...props} />
    </DockStoreContext.ProvideStore>
  )
})

// DockButton

export type DockButtonProps = ButtonProps & {
  label?: string
  labelProps?: Partial<TagLabelProps>
  visible?: boolean
  id: string
  showLabelOnHover?: boolean
}

const DockButtonPropsContext = createContextualProps<DockButtonProps>()
export const DockButtonPassProps = DockButtonPropsContext.PassProps

export const DockButton = (props: DockButtonProps) => {
  const {
    visible = true,
    id,
    label,
    showLabelOnHover,
    labelProps,
    ...buttonProps
  } = DockButtonPropsContext.useProps(props)
  const dockStore = DockStoreContext.useStore()
  const show = selectDefined(dockStore.items[id], visible)
  const [hovering, setHovering] = useState(false)

  useLayoutEffect(() => {
    dockStore.next[id] = visible
    dockStore.rerender()
  }, [visible])

  return (
    <Row
      pointerEvents="none"
      // TODO do it based on attachment
      flexDirection="row-reverse"
      position="relative"
      alignItems="center"
      justifyContent="flex-start"
      space={12}
    >
      <Button
        size="xl"
        width={40}
        height={40}
        circular
        iconSize={16}
        elevation={2}
        borderWidth={0}
        badgeProps={{
          background: '#333',
        }}
        zIndex={100000000}
        opacity={1}
        pointerEvents="auto"
        {...!show && { marginRight: -(50 + 15), opacity: 0 }}
        {...buttonProps}
        {...showLabelOnHover && {
          onMouseEnter() {
            setHovering(true)
          },
          onMouseLeave() {
            setHovering(false)
          },
        }}
      />
      {!!props.label && (
        <Theme name="tooltip">
          <TagLabel
            size="xxs"
            {...labelProps}
            {...showLabelOnHover && hovering && labelProps.hoverStyle}
          >
            {props.label}
          </TagLabel>
        </Theme>
      )}
    </Row>
  )
}

export type TagLabelProps = TagProps & {
  arrowSize?: number
  towards?: 'left' | 'right' | 'top' | 'bottom'
}

const TagLabel = ({
  // arrow props
  arrowSize = 12,
  towards,
  background,
  // chrome props
  maxWidth,
  position,
  top,
  left,
  bottom,
  right,
  display,
  opacity,
  transform,
  transition,
  hoverStyle,
  focusStyle,
  disabled,
  disabledStyle,
  active,
  activeStyle,
  hover,
  // tag props
  ...props
}: TagLabelProps) => {
  13
  return (
    <TagLabelChrome
      {...{
        maxWidth,
        position,
        top,
        left,
        bottom,
        right,
        display,
        opacity,
        transform,
        transition,
        hoverStyle,
        focusStyle,
        disabled,
        disabledStyle,
        active,
        activeStyle,
        hover,
      }}
    >
      {/* TODO do other directions */}
      {towards === 'right' && (
        <Arrow
          position="absolute"
          top={`50%`}
          transform={{
            y: -arrowSize / 2,
          }}
          right={-arrowSize * 2}
          size={arrowSize}
          towards={towards}
          background={background}
        />
      )}
      <Tag size="xs" maxWidth={maxWidth} background={background} {...props} />
    </TagLabelChrome>
  )
}

const TagLabelChrome = gloss(View, {
  position: 'relative',
  maxWidth: 'min-content',
})
