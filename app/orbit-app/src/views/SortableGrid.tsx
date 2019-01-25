import { Row, View } from '@mcro/ui'
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

export function SortableGrid(props: SortableContainerProps & { items?: any[] }) {
  return <SortableGridInner axis="xy" {...props} />
}
