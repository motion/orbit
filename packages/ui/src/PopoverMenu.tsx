import React, { forwardRef } from 'react'

import { ListItem, ListItemProps } from './lists/ListItem'
import { Popover, PopoverProps } from './Popover'
import { Col, ColProps } from './View/Col'

export type PopoverMenuProps = PopoverProps & {
  items: ListItemProps[]
  scrollable?: ColProps['scrollable']
}

export const PopoverMenu = forwardRef(
  (
    {
      items,
      borderRadius = 8,
      maxHeight = 300,
      scrollable = 'y',
      children,
      ...props
    }: PopoverMenuProps,
    ref,
  ) => {
    return (
      <Popover
        ref={ref}
        popoverTheme="tooltip"
        openOnClick
        closeOnClickAway
        closeOnClick
        width={300}
        background
        borderRadius={borderRadius}
        elevation={4}
        {...props}
      >
        <Col
          scrollable={scrollable}
          overflow="hidden"
          borderRadius={borderRadius}
          flex={1}
          maxHeight={maxHeight}
        >
          {children ||
            items.map((item, index) => {
              return <ListItem key={item.id || index} {...item} />
            })}
        </Col>
      </Popover>
    )
  },
)
