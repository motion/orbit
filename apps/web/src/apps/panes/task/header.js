import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import * as React from 'react'
import ColorBlock from './colorBlock'

@view.attach('millerStore')
@view
export default class TaskHeader {
  render({
    millerStore,
    data: { title },
    store: { labels, assigned },
    isActive,
  }) {
    const minSize = 1.4
    const maxSize = 2.5
    const titleSize = 3.4 - title.length * 0.05
    let labelsText = labels.length + ' Labels'
    if (labels.length === 0) labelsText = 'No Labels'
    if (labels.length === 1) labelsText = 'One Label'

    return (
      <header $isActive={isActive}>
        <meta css={{ padding: [0, 10] }}>
          <title $$row css={{ alignItems: 'center' }}>
            <UI.Title size={Math.min(maxSize, Math.max(titleSize, minSize))}>
              {title}
            </UI.Title>
          </title>
          <left>
            <UI.Icon size={22} name="github" css={{ marginRight: 10 }} />
          </left>
        </meta>
        <below>
          <badges>
            <UI.Text opacity={0.7} size={1.2} $id>
              #323
            </UI.Text>
            {labels.map(label => (
              <UI.Button
                chromeless
                icon={<ColorBlock size={16} id={label} />}
                iconSize={12}
                $badge
              >
                {label}
              </UI.Button>
            ))}
            {assigned.map(id => (
              <UI.Button chromeless iconSize={12} $badge>
                {id}
              </UI.Button>
            ))}
          </badges>
          <buttons>
            <UI.Button
              onClick={() => {
                millerStore.runAction('labels')
              }}
              className="target-labels"
              $button
            >
              {labelsText}
            </UI.Button>
            <UI.Button
              onClick={() => {
                millerStore.runAction('assign')
              }}
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
      width: '100%',
    },
    titleContainer: {
      alignItems: 'center',
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
    avatar: {
      width: 30,
      height: 30,
      borderRadius: 100,
      marginRight: 10,
    },
    when: {
      marginLeft: 10,
    },
  }
}
