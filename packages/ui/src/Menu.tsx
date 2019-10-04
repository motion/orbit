import React, { isValidElement } from 'react'

import { ListItem } from './lists/ListItem'
import { ListItemProps } from './lists/ListItemViewProps'
import { Popover, PopoverProps } from './Popover'
import { Stack, StackProps } from './View/Stack'

export type MenuProps = PopoverProps & {
  /** Pass in ListItemProps to determine the items in the popover. For full control you can use children instead */
  items?: (ListItemProps | React.ReactNode)[]
  scrollable?: StackProps['scrollable']
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
      // @ts-ignore
      popoverTheme="tooltip"
      openOnClick
      closeOnClickAway
      closeOnClick
      width={300}
      background
      borderRadius={borderRadius}
      elevation={4}
      distance={15}
      {...props}
    >
      <Stack
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
      </Stack>
    </Popover>
  )
}
