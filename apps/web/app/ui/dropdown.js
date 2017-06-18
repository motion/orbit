// @flow
import React from 'react'
import { view } from '@jot/black'
import List from './list'
import Popover from './popover'

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
          overlay="transparent"
          escapable
          animation="slide 100ms"
          target={children}
          {...popoverProps}
        >
          <List
            {...props}
            controlled
            width={width}
            items={items}
            itemStyle={{
              padding: [0, 7, 0, 16],
              margin: [3, 0],
              fontWeight: 300,
              fontSize: 15,
              color: '#444',
              '&:hover': {
                background: '#5E95F7',
                color: 'white',
              },
            }}
            getItem={item => ({
              primary: item,
            })}
          />
        </Popover>
      </dropdown>
    )
  }
}
