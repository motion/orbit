import React from 'react'

import { BorderLeft } from '../Border'
import { Icon } from '../Icon'
import { Menu, MenuProps } from '../Menu'
import { useSurfaceHeight } from '../SizedSurface'
import { View } from '../View/View'
import { Button, ButtonProps } from './Button'

export type MenuButtonProps = ButtonProps & {
  items?: MenuProps['items']
  scrollable?: MenuProps['scrollable']
}

export const MenuButton = ({ items, scrollable, ...rest }: MenuButtonProps) => {
  const height = useSurfaceHeight(rest.size)
  return (
    <Button
      after={
        <Menu
          items={items}
          scrollable={scrollable}
          target={
            <View
              height={height}
              onClick={preventPropagation}
              position="relative"
              justifyContent="center"
              padding={[0, 0, 0, 'sm']}
              margin={[0, 0, 0, 'xs']}
            >
              <BorderLeft />
              <Icon size={12} name="caret-down" />
            </View>
          }
        />
      }
      {...rest}
    />
  )
}

const preventPropagation = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
  e.preventDefault()
  e.stopPropagation()
}
