// @flow
import React from 'react'
import { view } from '@jot/black'
import List from './list'
import Popover from './popover'
import Arrow from './arrow'

export type Props = {
  children: React$Element | string,
  onChange?: Function,
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

  render({ children, onChange, width, items, popoverProps, ...props }: Props) {
    return (
      <dropdown>
        <Popover
          openOnClick
          openOnHover
          escapable
          target={
            <target>
              {children}
              <Arrow $arrow theme="light" size={6} />
            </target>
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
      opacity: 0.5,
      '&:hover': {
        opacity: 1,
      },
    },
  }
}
