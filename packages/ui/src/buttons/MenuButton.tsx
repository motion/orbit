import React, { memo, useRef } from 'react'

import { BorderLeft } from '../Border'
import { Icon, IconProps } from '../Icon'
import { Menu, MenuProps } from '../Menu'
import { useSizedSurfaceProps, useSurfaceHeight } from '../SizedSurface'
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
  const { items, scrollable, children, openIconProps, open, openOnHover, ...rest } = props
  const sizedSurfaceProps = useSizedSurfaceProps(props)
  const height = useSurfaceHeight(rest.size)
  // using the same group ensures the tooltip closes when the menu opens
  const group = useRef(`${Math.random()}`).current
  return (
    <Button tooltipProps={{ group }} space="sm" {...rest}>
      {!!children && (
        <>
          <SimpleText>{children}</SimpleText>
          <Space size={sizedSurfaceProps.sizePadding} scale={0.55} />
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
            <Space size={sizedSurfaceProps.sizePadding} scale={0.55} />
            {!!children && <BorderLeft top={4} bottom={4} />}
            <Icon size={12} name="caret-down" {...openIconProps} />
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
