import { SortableContainer, SortableContainerProps, SortableElement, SortableElementProps } from '@o/react-sortable-hoc'
import { Grid, GridProps } from 'gloss'
import React from 'react'

import { isRightClick } from './helpers/isRightClick'
import { View } from './View/View'

export type GetGridItem<A> = (item: A, index: number) => any
export type GetSortableItem<A> = (
  item: A,
  index: number,
) => Partial<SortableElementProps> | undefined | null

export type SortableGridProps<A = any> = SortableContainerProps &
  Omit<GridProps, 'onSelect'> & {
    /** The items to be used for getItem in the grid */
    items?: A[]
    /** Callback that return the react node for each item */
    getItem?: GetGridItem<A>
    getSortableItemProps?: GetSortableItem<A>
    sortable?: boolean
  }

type SortableGridItemProps = {
  value: any
  getItem: GetGridItem<any>
  realIndex: number
}

class SortableGridItem extends React.PureComponent<SortableGridItemProps> {
  render() {
    const { value, realIndex, getItem } = this.props
    return <View zIndex={100000}>{getItem(value, realIndex)}</View>
  }
}

const SortableItem = SortableElement(SortableGridItem)

const SortableGridInner = SortableContainer(
  ({ items, getItem, getSortableItemProps, sortable, ...props }: any) => {
    return (
      <Grid autoFitRows autoFitColumns {...props}>
        {items.map((value, index) => (
          <SortableItem
            key={`item-${value.id || index}`}
            index={index}
            realIndex={index}
            value={value}
            getItem={getItem}
            disabled={!sortable}
            {...(getSortableItemProps && getSortableItemProps(items[index], index)) || null}
          />
        ))}
      </Grid>
    )
  },
)

export function SortableGrid<A>(props: SortableGridProps<A>) {
  return (
    <SortableGridInner
      helperClass="sortableHelper"
      sortable={false}
      shouldCancelStart={isRightClick}
      axis="xy"
      {...props}
    />
  )
}
