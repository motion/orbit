// @flow
import React from 'react'
import { view } from '@mcro/black'
import List from './list'
import Button from './button'
import Popover from './popover'
import Arrow from './arrow'
import type { Color } from '@mcro/gloss'

export type Props = {
  children: React$Element<any> | string,
  onChange?: Function,
  color?: Color,
  width?: number,
  items?: Array<string>,
  popoverProps?: Object,
}

@view
export default class Dropdown {
  props: Props

  static defaultProps = {
    width: 100,
  }

  render({
    color,
    children,
    onChange,
    width,
    items,
    popoverProps,
    theme,
    ...props
  }: Props) {
    return (
      <dropdown>
        <Popover
          openOnClick
          openOnHover
          closeOnEsc
          background
          theme={theme}
          borderRadius={6}
          elevation={3}
          arrowSize={12}
          distance={4}
          target={
            <Button
              inline
              iconAfter
              icon={
                <icon>
                  <Arrow $arrow theme="light" size={6} color={color} />
                </icon>
              }
              $$color={color}
            >
              {children}
            </Button>
          }
          {...popoverProps}
        >
          <List
            {...props}
            controlled
            width={width}
            items={items}
            getItem={item => ({
              primary: item,
            })}
          />
        </Popover>
      </dropdown>
    )
  }

  static style = {
    target: {
      flexFlow: 'row',
      alignItems: 'center',
    },
    icon: {
      marginLeft: 5,
    },
    arrow: {
      opacity: 0.9,
      '&:hover': {
        opacity: 1,
      },
    },
  }
}
