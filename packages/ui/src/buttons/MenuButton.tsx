import React, { memo, useRef } from 'react'

import { BorderLeft } from '../Border'
import { Icon, IconProps } from '../Icon'
import { Menu, MenuProps } from '../Menu'
import { useSurfaceHeight } from '../SizedSurface'
import { Space } from '../Space'
import { SimpleText } from '../text/SimpleText'
import { View } from '../View/View'
import { Button, ButtonProps } from './Button'

export type MenuButtonProps = ButtonProps &
  Pick<MenuProps, 'open' | 'items' | 'openOnHover'> & {
    scrollable?: MenuProps['scrollable']
    openIconProps?: IconProps
  }

export const MenuButton = memo(
  ({ items, scrollable, children, openIconProps, open, openOnHover, ...rest }: MenuButtonProps) => {
    const height = useSurfaceHeight(rest.size)
    // using the same group ensures the tooltip closes when the menu opens
    const group = useRef(`${Math.random()}`).current
    return (
      <Button tooltipProps={{ group }} sizePadding={0} space="sm" {...rest}>
        {!!children && (
          <>
            <Space size="sm" />
            <SimpleText>{children}</SimpleText>
            <Space size="sm" />
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
              position="relative"
              justifyContent="center"
              padding={[0, 'sm']}
            >
              {!!children && <BorderLeft top={4} bottom={4} />}
              <Icon size={12} name="caret-down" {...openIconProps} />
            </View>
          }
        />
      </Button>
    )
  },
)

const preventPropagation = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
  e.preventDefault()
  e.stopPropagation()
}
