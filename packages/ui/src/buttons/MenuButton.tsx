import React from 'react'

import { BorderLeft } from '../Border'
import { Icon } from '../Icon'
import { Menu, MenuProps } from '../Menu'
import { View } from '../View/View'
import { Button, ButtonProps } from './Button'

export type MenuButtonProps = ButtonProps & {
  items?: MenuProps['items']
  scrollable?: MenuProps['scrollable']
}

export const MenuButton = ({ items, scrollable, ...rest }) => {
  return (
    <Button
      after={
        <Menu
          items={items}
          scrollable={scrollable}
          target={
            <View position="relative" padding={[0, 0, 0, 'xs']} margin={[0, 0, 0, 'xs']}>
              <BorderLeft />
              <Icon size={12} name="chevron-down" />
            </View>
          }
        />
      }
      {...rest}
    />
  )
}
