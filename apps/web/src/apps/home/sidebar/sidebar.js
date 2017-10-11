import * as React from 'react'
import { view } from '@mcro/black'
import Fade from '../views/fade'
import StackNavigator from '../views/stackNavigator'
import SidebarMain from './columns/sidebarMain'
import SidebarOther from './columns/sidebarOther'

const width = 250
const columns = {
  main: SidebarMain,
  feed: SidebarOther,
}

@view
export default class Sidebar {
  render({ homeStore }) {
    return (
      <StackNavigator stack={homeStore.stack}>
        {({ stackItem, index, currentIndex, navigate }) => {
          if (!stackItem.data) {
            return <null>bad data</null>
          }
          const Column = columns[stackItem.data.type]
          if (!Column) {
            return <null>not found column {stackItem.data.type}</null>
          }
          return (
            <Fade
              key={index}
              width={width}
              index={index}
              currentIndex={currentIndex}
            >
              <Column
                stackItem={stackItem}
                navigate={navigate}
                setStore={stackItem.setStore}
                paneProps={{
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
    )
  }
}
