// @flow
import React from 'react'
import { view } from '@jot/black'
import List from './list'
import Button from './button'
import Popover from './popover'
import Arrow from './arrow'
import type { Color } from 'gloss'

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
    width: 200,
  }

  render({
    color,
    children,
    onChange,
    width,
    items,
    popoverProps,
    ...props
  }: Props) {
    return (
      <dropdown>
        <Popover
          openOnClick
          openOnHover
          escapable
          target={
            <Button
              icon={<Arrow $arrow theme="light" size={6} color={color} />}
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
            background
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
    arrow: {
      marginLeft: 5,
      opacity: 0.9,
      '&:hover': {
        opacity: 1,
      },
    },
  }
}
