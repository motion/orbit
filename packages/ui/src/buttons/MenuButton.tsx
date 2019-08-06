import React, { useRef } from 'react'

import { BorderLeft } from '../Border'
import { Icon } from '../Icon'
import { Menu, MenuProps } from '../Menu'
import { useSurfaceHeight } from '../SizedSurface'
import { Space } from '../Space'
import { SimpleText } from '../text/SimpleText'
import { View } from '../View/View'
import { Button, ButtonProps } from './Button'

export type MenuButtonProps = ButtonProps & {
  items?: MenuProps['items']
  scrollable?: MenuProps['scrollable']
}

export const MenuButton = ({ items, scrollable, children, ...rest }: MenuButtonProps) => {
  const height = useSurfaceHeight(rest.size)
  // using the same group ensures the tooltip closes when the menu opens
  const group = useRef(`${Math.random()}`).current
  return (
    <Button tooltipProps={{ group }} sizePadding={0} space="sm" {...rest}>
      {!!children && (
        <>
          <Space size="sm" />
          <SimpleText>{children}</SimpleText>
        </>
      )}
      <Menu
        items={items}
        scrollable={scrollable}
        group={group}
        target={
          <View
            height={height}
            onClick={preventPropagation}
            position="relative"
            justifyContent="center"
            padding={[0, 'sm']}
          >
            {!!children && <BorderLeft top={4} bottom={4} />}
            <Icon size={12} name="caret-down" />
          </View>
        }
      />
    </Button>
  )
}

const preventPropagation = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
  e.preventDefault()
  e.stopPropagation()
}
