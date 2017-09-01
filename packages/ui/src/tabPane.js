// @flow
import * as React from 'react'
import { view } from '@mcro/black'

@view.ui
export default class TabPane extends React.Compoent<{}, { selected: number }> {
  state = {
    selected: 0,
  }

  handleSelect = selected => () => {
    this.setState({ selected })
  }

  render({ tabs, children, ...props }: Props) {
    const total = tabs.length
    const totalChildren = React.Children.count(children)

    if (total !== totalChildren) {
      console.error('Children doesn\'t match length of tabs!')
      return null
    }

    return (
      <tabpane>
        <tabs>
          {tabs.map((tab, index) =>
            <tab
              key={index}
              onClick={this.handleSelect(index)}
              $activeTab={index === this.state.selected}
            >
              {tab}
            </tab>
          )}
        </tabs>
        <content>
          {React.Children.map(children, (child, index) => {
            if (!child) {
              return child
            }
            if (index !== this.state.selected) {
              return null
            }
            return React.cloneElement(child, { chromeless: true })
          })}
        </content>
      </tabpane>
    )
  }

  static style = {
    tabpane: {
      boxShadow: [[0, 0, 0, 2, [0, 0, 0, 0.2]]],
      background: '#f2f2f2',
    },
    tabs: {
      flexFlow: 'row',
      borderBottom: [1, [0, 0, 0, 0.05]],
    },
    tab: {
      background: '#f2f2f2',
      padding: [10, 12],
      marginBottom: -1,
      borderRight: [1, [0, 0, 0, 0.05]],
      borderBottom: [1, [0, 0, 0, 0.05]],
      minWidth: 90,
      alignItems: 'center',
      justifyContent: 'center',
      flex: 1,
      maxWidth: '100%',
      overflow: 'hidden',
    },
    activeTab: {
      fontWeight: 600,
      background: '#fff',
      borderRight: [1, [0, 0, 0, 0.1]],
      borderBottom: [1, 'transparent'],
    },
    content: {
      flex: 1,
      background: '#fff',
    },
  }
}
