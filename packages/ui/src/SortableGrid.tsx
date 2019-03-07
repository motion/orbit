import { Grid, View, ViewProps } from '@mcro/gloss'
import {
  SortableContainer,
  SortableContainerProps,
  SortableElement,
  SortableElementProps,
} from '@mcro/react-sortable-hoc'
import React from 'react'
import { isRightClick } from './helpers/isRightClick'

export type GetGridItem<A> = (item: A, index: number) => any
export type GetSortableItem<A> = (item: A, index: number) => Partial<SortableElementProps>

export type SortableGridProps<A extends any> = SortableContainerProps &
  ViewProps & {
    items?: A[]
    getItem?: GetGridItem<A>
    getSortableItemProps?: GetSortableItem<A>
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
  ({ items, getItem, getSortableItemProps, ...props }: any) => {
    return (
      <Grid {...props}>
        {items.map((value, index) => (
          <SortableItem
            key={`item-${value.id}`}
            index={index}
            realIndex={index}
            value={value}
            getItem={getItem}
            {...getSortableItemProps && getSortableItemProps(items[index], index)}
          />
        ))}
      </Grid>
    )
  },
)

export function SortableGrid(props: SortableGridProps<any>) {
  return <SortableGridInner shouldCancelStart={isRightClick} axis="xy" {...props} />
}
