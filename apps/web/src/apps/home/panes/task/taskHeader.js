import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import * as React from 'react'
import ColorBlock from './colorBlock'

@view
export default class TaskHeader {
  render({ taskStore }) {
    const { title } = taskStore.result
    const { task } = taskStore
    const labels = (task && task.data.labals) || []

    const minSize = 1.8
    const maxSize = 2.2
    const ogSize = 3.4 - title.length * 0.05
    const titleSize = Math.min(maxSize, Math.max(ogSize, minSize))
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
          <UI.Title
            flex={1}
            fontWeight={800}
            color={[0, 0, 0]}
            size={titleSize}
          >
            {title}
          </UI.Title>
          <left>
            <UI.Icon size={22} name="github" css={{ marginRight: 10 }} />
          </left>
        </meta>
        <below if={task}>
          <badges>
            <left $$row>
              <UI.Text opacity={0.7} size={1.2} $id>
                #{task.data.number + ''}
              </UI.Text>
              <UI.Text opacity={1} size={1} $id>
                in{' '}
                <a href="">
                  {task.data.orgName}/{task.data.parentId}
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
            <UI.Button onClick={() => {}} className="target-labels" $button>
              {labelsText}
            </UI.Button>
            <UI.Button onClick={() => {}} className="target-assign" $button>
              Assign
            </UI.Button>
          </buttons>
        </below>
      </header>
    )
  }

  static style = {
    header: {
      width: '100%',
    },
    below: {
      flexFlow: 'row',
      alignItems: 'center',
      padding: [5, 10],
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
    id: {
      marginRight: 10,
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
