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

const { ago } = timeAgo()

@view class Item {
  render({
    active,
    inProgress,
    onStart,
    noDrag,
    onClick,
    index,
    task,
    ...props
  }) {
    const className = 'strikethrough ' + (task.archive ? 'active' : '')

    // up to 5 days ago
    const time = ago(+Date.now() - Math.random() * 5 * 24 * 60 * 60 * 1000)

    // css structure is for archive animation
    return (
      <item
        onClick={onClick}
        $$undraggable
        $first={index === 0}
        $active={active === true}
        $inProgress={inProgress}
        $notInProgress={!inProgress}
      >
        <Button
          if={inProgress}
          $startIcon
          onClick={onStart}
          icon="ui-1_check-curve"
        />
        <Button
          chromeless
          if={!inProgress}
          $startIcon
          onClick={onStart}
          icon="media-1_button-play"
        />
        <content>
          <Text $text {...props}>
            <div className={className}>
              <p><span>{task.text}</span></p>
            </div>
          </Text>
          <bottom $$row>
            <tags>
              {time} · Nate
            </tags>
          </bottom>
        </content>
        <Button
          $button
          $activeDoc={window.location.pathname.indexOf(task.doc.url()) === 0}
          onMouseDown={() => Router.go(task.doc.url())}
        >
          {task.doc.title}
        </Button>

        <DragHandle if={!noDrag} />
      </item>
    )
  }

  static style = {
    content: {
      flex: 3,
      marginLeft: 5,
      marginRight: 5,
    },
    startIcon: {
      marginLeft: 5,
      marginRight: 5,
    },
    button: {
      marginRight: 5,
      transition: 'all 100ms ease-in',
    },
    activeDoc: {
      pointerEvents: 'none',
      opacity: 0.7,
    },
    greenDot: {
      background: '#54ff54',
      width: 10,
      opacity: 0.5,
      height: 10,
      borderRadius: 10,
      margin: 10,
      border: `1px solid #24cc24`,
    },
    inProgress: {
      borderTop: '1px solid #ddd',
    },
    notInProgress: {
      boxShadow: '1px 1px 5px rgba(0,0,0,0.2)',
    },
    first: {
      borderTop: '1px solid #ddd',
    },
    tags: {
      color: `rgba(0, 0, 0, 0.6)`,
      fontSize: 12,
    },
    text: {},
    bottom: {
      flex: 1,
      justifyContent: 'space-between',
    },
    item: {
      flexFlow: 'row',
      padding: [7, 5],
      background: '#fefefe',
      justifyContent: 'center',
      alignItems: 'center',
      borderBottom: '1px solid #ddd',
      fontSize: 14,
      alignItems: 'center',
      justifyContent: 'space-between',
      transition: 'background 60ms ease-in',
    },
    active: {
      background: 'rgba(254, 255, 237, 1)',
    },
    span: {
      paddingTop: 2,
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
