// @flow
import * as React from 'react'
import { view } from '@mcro/black'
import Fade from '../views/fade'
import StackNavigator from '../views/stackNavigator'
import SidebarMain from './columns/sidebarMain'
import SidebarOther from './columns/sidebarOther'

const width = 250

const columns = {
  main: SidebarMain,
  other: SidebarOther,
}

@view
export default class Sidebar extends React.Component<Props> {
  render({ homeStore }: Props) {
    return (
      <StackNavigator stack={homeStore.stack}>
        {({ stackItem, index, currentIndex, navigate }) => {
          const Column = columns[stackItem.data.type]
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
