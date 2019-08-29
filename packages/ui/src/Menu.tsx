import React, { isValidElement } from 'react'

import { ListItem, ListItemProps } from './lists/ListItem'
import { Popover, PopoverProps } from './Popover'
import { Col, ColProps } from './View/Col'

export type MenuProps = PopoverProps & {
  /** Pass in ListItemProps to determine the items in the popover. For full control you can use children instead */
  items?: (ListItemProps | React.ReactNode)[]
  scrollable?: ColProps['scrollable']
}

export const Menu = ({
  items,
  borderRadius = 8,
  maxHeight = 450,
  scrollable = 'y',
  children,
  ...props
}: MenuProps) => {
  return (
    <Popover
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
        elevation={3}
      >
        {children ||
          items.map((item, index) => {
            if (isValidElement(item)) {
              return item
            }
            return <ListItem key={item['id'] || index} {...item as any} />
          })}
      </Col>
    </Popover>
  )
}
