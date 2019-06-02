import { SortableContainer, SortableContainerProps, SortableElement, SortableElementProps } from '@o/react-sortable-hoc'
import { Grid } from 'gloss'
import React from 'react'

import { isRightClick } from './helpers/isRightClick'
import { Omit } from './types'
import { View, ViewProps } from './View/View'

export type GetGridItem<A> = (item: A, index: number) => any
export type GetSortableItem<A> = (item: A, index: number) => Partial<SortableElementProps>

export type SortableGridProps<A extends any> = SortableContainerProps &
  Omit<ViewProps, 'onSelect'> & {
    items?: A[]
    getItem?: GetGridItem<A>
    getSortableItemProps?: GetSortableItem<A>
    sortable?: boolean
  }

type SortableGridItemProps = {
  value: any
  getItem: GetGridItem<any>
  realIndex: number
}

class GridItem extends React.PureComponent<SortableGridItemProps> {
  render() {
    const { value, realIndex, getItem } = this.props
    return <View zIndex={100000}>{getItem(value, realIndex)}</View>
  }
}

const SortableItem = SortableElement(GridItem)

const SortableGridInner = SortableContainer(
  ({ items, getItem, getSortableItemProps, sortable, ...props }: any) => {
    return (
      <Grid autoFitRows autoFitColumns {...props}>
        {items.map((value, index) => (
          <SortableItem
            key={`item-${value.id}`}
            index={index}
            realIndex={index}
            value={value}
            getItem={getItem}
            disabled={!sortable}
            {...getSortableItemProps && getSortableItemProps(items[index], index)}
          />
        ))}
      </Grid>
    )
  },
)

export function SortableGrid<A>(props: SortableGridProps<A>) {
  return (
    <SortableGridInner sortable={false} shouldCancelStart={isRightClick} axis="xy" {...props} />
  )
}
