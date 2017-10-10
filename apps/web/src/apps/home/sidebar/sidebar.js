// @flow
import * as React from 'react'
import { view } from '@mcro/black'
import Fade from '../views/fade'
import StackNavigator from '../views/stackNavigator'
import SidebarColumn from './sidebarColumn'

const width = 250

@view
export default class Sidebar extends React.Component<Props> {
  render({ homeStore }: Props) {
    return (
      <StackNavigator stack={homeStore.stack}>
        {({ stackItem, index, currentIndex, navigate }) => {
          console.log('StackNavigator', stackItem, index, currentIndex)
          return (
            <Fade
              key={index}
              width={width}
              index={index}
              currentIndex={currentIndex}
            >
              <SidebarColumn
                stackItem={stackItem}
                navigate={navigate}
                paneProps={{
                  primary: true,
                  getActiveIndex: () => {
                    console.log('GET ME', homeStore.stack.last.activeRow[0])
                    return homeStore.stack.last.activeRow[0]
                  },
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
