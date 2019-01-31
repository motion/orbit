import { Row, View, ViewProps } from '@mcro/ui'
import React from 'react'
import { SortableContainer, SortableContainerProps, SortableElement } from 'react-sortable-hoc'

type GetGridItem<A> = (item: A, index: number) => any

export type SortableGridProps<A extends any> = SortableContainerProps &
  ViewProps & {
    items?: A[]
    getItem?: GetGridItem<A>
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

const SortableGridInner = SortableContainer(({ items, getItem, ...props }: any) => {
  return (
    <Row overflow="hidden" flexWrap="wrap" {...props}>
      {items.map((value, index) => (
        <SortableItem
          key={`item-${value.id}`}
          index={index}
          realIndex={index}
          value={value}
          getItem={getItem}
        />
      ))}
    </Row>
  )
})

export function SortableGrid(props: SortableGridProps<any>) {
  return <SortableGridInner axis="xy" pressDelay={150} {...props} />
}
