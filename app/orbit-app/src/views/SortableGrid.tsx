import { Row, View, ViewProps } from '@mcro/ui'
import React from 'react'
import { SortableContainer, SortableContainerProps, SortableElement } from 'react-sortable-hoc'

const SortableItem = SortableElement(({ value }: any) => <View>{value}</View>)

const SortableGridInner = SortableContainer(({ items, ...props }: any) => {
  return (
    <Row overflow="hidden" flexWrap="wrap" {...props}>
      {items.map((value, index) => (
        <SortableItem key={`item-${index}`} index={index} value={value} />
      ))}
    </Row>
  )
})

type SortableGridProps = SortableContainerProps &
  ViewProps & {
    items?: any[]
  }

export function SortableGrid(props: SortableGridProps) {
  return <SortableGridInner axis="xy" {...props} />
}
