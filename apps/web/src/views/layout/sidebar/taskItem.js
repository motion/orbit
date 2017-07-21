// @flow
import React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import Router from '~/router'
import timeAgo from 'time-ago'
import DragHandle from './dragHandle'

const { ago } = timeAgo()
@view
export default class Item {
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
        <UI.Button
          if={inProgress}
          $startIcon
          onClick={onStart}
          icon="ui-1_check-curve"
        />
        <UI.Button
          chromeless
          if={!inProgress}
          $startIcon
          onClick={onStart}
          icon="media-1_button-play"
        />
        <content>
          <UI.Text $text {...props}>
            <div className={className}>
              <p>
                <span>
                  {task.text}
                </span>
              </p>
            </div>
          </UI.Text>
          <bottom if={false} $$row>
            <tags>
              {time} · Nate
            </tags>
          </bottom>
        </content>
        <UI.Button
          $button
          $activeDoc={window.location.pathname.indexOf(task.doc.url()) === 0}
          onMouseDown={() => Router.go(task.doc.url())}
        >
          {task.doc.title}
        </UI.Button>

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
      border: '1px solid #24cc24',
    },
    inProgress: {
      borderTop: '1px solid #ddd',
    },
    notInProgress: {
      boxShadow: '1px 1px 5px rgba(0,0,0,0.05)',
    },
    first: {
      borderTop: '1px solid #ddd',
    },
    tags: {
      color: 'rgba(0, 0, 0, 0.6)',
      fontSize: 12,
    },
    text: {
      cursor: 'default',
    },
    bottom: {
      flex: 1,
      justifyContent: 'space-between',
    },
    item: {
      flexFlow: 'row',
      padding: [7, 5],
      background: '#fefefe',
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
