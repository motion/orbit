import React from 'react'
import { view } from '@jot/black'
import {
  Text,
  Pane,
  ContextMenu,
  List,
  Icon,
  Link,
  Input,
  Segment,
  Button,
  SlotFill,
} from '~/ui'
import {
  SortableContainer,
  SortableElement,
  SortableHandle,
} from 'react-sortable-hoc'
import timeAgo from 'time-ago'
import DragHandle from './dragHandle'
import Item from './taskItem'

const { ago } = timeAgo()

/* sortable eats index, so add _index for item styling */
const SortableItem = SortableElement(
  ({ active, onStart, onClick, _index, value }) => (
    <div style={{ zIndex: 1000000 }}>
      <Item
        active={active}
        onClick={onClick}
        onStart={onStart}
        index={_index}
        task={value}
      />
    </div>
  )
)

const SortableList = SortableContainer(
  ({ active, onStart, onClick, items }) => {
    return (
      <ul>
        {items.map((task, index) => (
          <SortableItem
            onClick={() => onClick(task)}
            onStart={() => onStart(task)}
            active={active && active.key === task.key}
            key={task.key}
            _index={index}
            index={index}
            value={task}
          />
        ))}
      </ul>
    )
  }
)

@view
export default class Items {
  render({ store }) {
    return (
      <SortableList
        onClick={store.onSelect}
        onStart={store.onSetProgress}
        active={store.activeTask}
        items={store.tasks}
        useDragHandle={true}
        onSortEnd={store.onSortEnd}
      />
    )
  }
}
