import React, { memo, useRef } from 'react'

import { BorderLeft } from '../Border'
import { useScaledSize, useSizedSurfaceProps, useSurfaceHeight } from '../hooks/useSizedSurface'
import { Icon, IconProps } from '../Icon'
import { Menu, MenuProps } from '../Menu'
import { getSize } from '../Sizes'
import { Space } from '../Space'
import { SimpleText } from '../text/SimpleText'
import { View } from '../View/View'
import { Button, ButtonProps } from './Button'

export type MenuButtonProps = ButtonProps &
  Pick<MenuProps, 'open' | 'items' | 'openOnHover'> & {
    scrollable?: MenuProps['scrollable']
    openIconProps?: IconProps
  }

export const MenuButton = memo((props: MenuButtonProps) => {
  const { items, scrollable, children, openIconProps, open, openOnHover, size, ...rest } = props
  const sizedSurfaceProps = useSizedSurfaceProps(props)
  const sizePx = getSize(size)
  const spaceSizePx = +getSize('sm') * sizePx
  const scaledSize = useScaledSize(size)
  const height = useSurfaceHeight(size)
  // using the same group ensures the tooltip closes when the menu opens
  const group = useRef(`${Math.random()}`).current
  const spaceElement = <Space size={sizedSurfaceProps.sizePadding} scale={0.55 * sizePx} />
  return (
    <Button tooltipProps={{ group }} paddingRight={0} size={size} {...rest}>
      {!!children && (
        <>
          <SimpleText size={size}>{children}</SimpleText>
          {spaceElement}
        </>
      )}
      <Menu
        items={items}
        scrollable={scrollable}
        group={group}
        {...{
          open,
          items,
          openOnHover,
          size,
        }}
        target={
          <View
            height={height}
            onClick={preventPropagation}
            flexDirection="row"
            alignItems="center"
            position="relative"
            justifyContent="center"
          >
            {spaceElement}
            {!!children && <BorderLeft top={4} bottom={4} />}
            <Icon size={12 * scaledSize} name="caret-down" color={rest.color} {...openIconProps} />
            {spaceElement}
          </View>
        }
      />
    </Button>
  )
})

const preventPropagation = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
  e.preventDefault()
  e.stopPropagation()
}
