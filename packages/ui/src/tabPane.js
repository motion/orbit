// @flow
import React from 'react'
import { view } from '@mcro/black'

@view.ui
export default class TabPane {
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
              $activeTab={index === this.state.index}
            >
              {tab}
            </tab>
          )}
        </tabs>
        <content>
          {React.Children.map(children, child => {
            if (!child) {
              return child
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
      background: '#fefefe',
    },
    tabs: {
      flexFlow: 'row',
      borderBottom: [1, [0, 0, 0, 0.05]],
    },
    tab: {
      background: '#fefefe',
      padding: [5, 8],
      borderRight: [1, [0, 0, 0, 0.05]],
      minWidth: 90,
      alignItems: 'center',
    },
    activeTab: {
      fontWeight: 600,
      background: '#fff',
    },
    content: {
      flex: 1,
      background: '#fff',
    },
  }
}
