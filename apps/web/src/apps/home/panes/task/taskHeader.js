import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import * as React from 'react'
import ColorBlock from './colorBlock'
import { Title } from '~/views'

@view
export default class TaskHeader {
  render({ taskStore, result }) {
    const { title } = result
    const { task } = taskStore
    const labels = (task && task.data.labals) || []

    if (!title) {
      return null
    }

    let labelsText = labels.length + ' Labels'
    if (labels.length === 0) {
      labelsText = 'No Labels'
    }
    if (labels.length === 1) {
      labelsText = 'One Label'
    }

    return (
      <header>
        <meta css={{ padding: 10, paddingTop: 20 }}>
          <Title>{title}</Title>
          <left>
            <UI.Text if={task} opacity={0.7} size={2} css={{ marginRight: 20 }}>
              #{result.number || task.data.number}
            </UI.Text>
            <UI.Icon size={36} name="github" css={{ marginRight: 10 }} />
          </left>
        </meta>
        <below if={task}>
          <badges>
            <left $$row>
              <UI.Text opacity={1} size={1.3} $id>
                in{' '}
                <a href="">
                  {task.orgName}/{task.parentId}
                </a>
              </UI.Text>
            </left>
            {labels.map(label => (
              <UI.Button
                key={label}
                chromeless
                icon={<ColorBlock size={16} id={label} />}
                iconSize={12}
                $badge
              >
                {label}
              </UI.Button>
            ))}
            {(task.data.assigned || []).map(id => (
              <UI.Button key={id} chromeless iconSize={12} $badge>
                {id}
              </UI.Button>
            ))}
          </badges>
          <buttons>
            <UI.Button
              size={1.1}
              onClick={() => {}}
              className="target-labels"
              $button
            >
              {labelsText}
            </UI.Button>
            <UI.Button
              size={1.1}
              onClick={() => {}}
              className="target-assign"
              $button
            >
              Assign
            </UI.Button>
          </buttons>
        </below>
      </header>
    )
  }

  static style = {
    header: {
      padding: [0, 15, 0],
      width: '100%',
    },
    below: {
      flexFlow: 'row',
      alignItems: 'flex-start',
      padding: [0, 10],
      justifyContent: 'space-between',
    },
    meta: {
      justifyContent: 'space-between',
      alignItems: 'center',
      flexFlow: 'row',
    },
    badges: {
      flexFlow: 'row',
    },
    badge: {
      marginLeft: 6,
    },
    left: {
      flexFlow: 'row',
      alignItems: 'center',
      justifyContent: 'flex-end',
    },
    buttons: {
      flexFlow: 'row',
      alignItems: 'center',
    },
    button: {
      margin: 5,
    },
    firstComment: {
      marginTop: 20,
    },
    info: {
      alignItems: 'center',
      marginTop: 5,
    },
    name: {
      fontWeight: 500,
    },
    when: {
      marginLeft: 10,
    },
  }
}
