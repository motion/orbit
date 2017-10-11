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
          if (index !== currentIndex) {
            return null
          }
          const active = stackItem.data
          if (!active) {
            return <null>Nothing selected</null>
          }
          const Pane = Panes[active.type]
          if (!Pane) {
            return <null>not found {active.type}</null>
          }
          return (
            <Pane
              stackItem={stackItem}
              navigate={navigate}
              data={stackItem.data}
              paneProps={{
                index,
                getActiveIndex: () => stackItem.firstIndex,
              }}
            />
          )
        }}
      </StackNavigator>
    )
  }
}
