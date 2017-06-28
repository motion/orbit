import React from 'react'
import { view } from '@mcro/black'
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
} from '@mcro/ui'
import {
  SortableContainer,
  SortableElement,
  SortableHandle,
} from 'react-sortable-hoc'
import DragHandle from './dragHandle'

@view class Item {
  render({ item, index }) {
    const first = index === 0

    return (
      <item $first={first} $$row>
        <content $$row>
          <name>{item.name}</name>
          <task>{item.task}</task>
        </content>
        <DragHandle />
      </item>
    )
  }

  static style = {
    item: {
      flexFlow: 'row',
      padding: [7, 5],
      background: '#fefefe',
      alignItems: 'center',
      borderBottom: '1px solid #ddd',
      fontSize: 14,
      justifyContent: 'space-between',
      transition: 'background 60ms ease-in',
    },
    first: {
      borderTop: '1px solid #ddd',
    },
    content: {
      marginLeft: 10,
    },
    task: {
      marginLeft: 20,
    },
    name: {
      maxWidth: 100,
      textTransform: 'capitalize',
    },
  }
}

/* sortable eats index, so add _index for item styling */
const SortableItem = SortableElement(
  ({ active, onStart, onClick, _index, value }) => (
    <div style={{ zIndex: 1000000 }}>
      <Item
        active={active}
        onClick={onClick}
        onStart={onStart}
        index={_index}
        item={value}
      />
    </div>
  )
)

const SortableList = SortableContainer(
  ({ active, onStart, onClick, items }) => {
    return (
      <ul>
        {items.map((user, index) => (
          <SortableItem
            onClick={() => onClick(user)}
            onStart={() => onStart(user)}
            active={active && active.key === user.key}
            key={index}
            _index={index}
            index={index}
            value={user}
          />
        ))}
      </ul>
    )
  }
)

@view
export default class Team {
  render({ store }) {
    return (
      <users>
        <ContextMenu
          $context
          options={[
            {
              title: 'Delete',
              onSelect: place => place.delete(),
            },
          ]}
        >
          <SortableList
            active={store.activeUser}
            items={store.team}
            useDragHandle={true}
            onSortEnd={() => {}}
          />
        </ContextMenu>
      </users>
    )
  }

  static style = {}
}
