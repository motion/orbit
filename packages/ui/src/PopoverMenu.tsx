import React, { forwardRef } from 'react'

import { ListItem, ListItemProps } from './lists/ListItem'
import { Popover, PopoverProps } from './Popover'
import { Omit } from './types'
import { Col, ColProps } from './View/Col'

export type PopoverMenuProps = Omit<PopoverProps, 'children'> & {
  items: ListItemProps[]
  scrollable?: ColProps['scrollable']
}

export const PopoverMenu = forwardRef(
  (
    { items, borderRadius = 5, maxHeight = 300, scrollable = 'y', ...props }: PopoverMenuProps,
    ref,
  ) => {
    return (
      <Popover
        ref={ref}
        openOnClick
        closeOnClickAway
        closeOnClick
        width={300}
        background
        borderRadius={borderRadius}
        elevation={4}
        {...props}
      >
        <Col scrollable={scrollable} borderRadius={borderRadius} flex={1} maxHeight={maxHeight}>
          {items.map((item, index) => {
            return <ListItem key={item.id || index} {...item} />
          })}
        </Col>
      </Popover>
    )
  },
)
