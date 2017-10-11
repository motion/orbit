import * as React from 'react'
import { view } from '@mcro/black'
import Fade from '../views/fade'
import StackNavigator from '../views/stackNavigator'
import * as Panes from './panes'

@view
export default class Main {
  render({ homeStore }) {
    return (
      <StackNavigator stack={homeStore.stack}>
        {({ stackItem, index, currentIndex, navigate }) => {
          const active = stackItem.selectedResult
          if (!active) {
            return <null>Nothing selected</null>
          }
          const Pane = Panes[active.type]
          if (!Pane) {
            return <null>not found</null>
          }
          return (
            <Fade
              key={index}
              style={{
                flex: 1,
              }}
              index={index}
              currentIndex={currentIndex}
            >
              <Pane
                stackItem={stackItem}
                navigate={navigate}
                paneProps={{
                  getActiveIndex: () => stackItem.firstIndex,
                }}
              />
            </Fade>
          )
        }}
      </StackNavigator>
    )
  }
}
