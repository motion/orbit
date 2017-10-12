import * as React from 'react'
import { view } from '@mcro/black'
import Fade from './views/fade'
import StackNavigator from './views/stackNavigator'
import * as Panes from './panes'

const width = 250

@view
export default class Sidebar {
  render({ homeStore }) {
    return (
      <sidebar css={{ width }}>
        <StackNavigator stack={homeStore.stack}>
          {({ stackItem, index, currentIndex, navigate }) => {
            // only show last two
            if (index + 1 < currentIndex) {
              return null
            }
            if (!stackItem.data) {
              return <null>bad data</null>
            }
            const Pane = Panes[stackItem.data.type]
            if (!Pane || !Pane.Sidebar) {
              return <null>not found Pane {stackItem.data.type}</null>
            }
            return (
              <Fade
                key={index}
                width={width}
                index={index}
                currentIndex={currentIndex}
              >
                <Pane.Sidebar
                  stackItem={stackItem}
                  navigate={navigate}
                  setStore={stackItem.setStore}
                  data={stackItem.data}
                  onBack={homeStore.stack.pop}
                  paneProps={{
                    index,
                    primary: true,
                    getActiveIndex: () => stackItem.firstIndex,
                    onSelect: stackItem.onSelect,
                    itemProps: {
                      size: 1.14,
                      glow: true,
                      padding: [10, 12],
                      iconAfter: true,
                    },
                    width,
                    groupKey: 'category',
                  }}
                />
              </Fade>
            )
          }}
        </StackNavigator>
      </sidebar>
    )
  }
}
