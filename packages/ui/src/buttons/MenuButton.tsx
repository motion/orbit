import React from 'react'

import { BorderLeft } from '../Border'
import { Icon } from '../Icon'
import { Menu, MenuProps } from '../Menu'
import { View } from '../View/View'
import { Button, ButtonProps } from './Button'

export type MenuButtonProps = ButtonProps & Pick<MenuProps, 'items' | 'scrollable'>

export const MenuButton = ({ items, scrollable, ...rest }) => {
  return (
    <Menu
      items={items}
      scrollable={scrollable}
      target={
        <Button
          after={
            <View position="relative" pad={[0, 0, 0, 'sm']} margin={[0, 0, 0, 'sm']}>
              <BorderLeft />
              <Icon name="chevron-down" />
            </View>
          }
          {...rest}
        />
      }
    />
  )
}
