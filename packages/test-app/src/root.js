import * as React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'

@view({
  store: class TestStore {
    x = 0

    didMount() {
      console.log('hi there')
    }
  },
})
export class Root extends React.Component {
  render({ store }) {
    return (
      <root>
        <UI.Button size={2}>Hello world</UI.Button>
        <thing onClick={() => (store.x = store.x + 1)}>wtf {store.x}</thing>
      </root>
    )
  }

  static style = {
    root: {
      position: 'relative',
      overflow: 'hidden',
      background: 'orange',
    },
    // thing: {
    //   background: 'yellow',
    //   width: 100,
    //   height: 100,
    // },
  }

  static theme = props => ({
    thing: {
      background: 'green',
      width: 100,
      height: 100,
    },
  })
}
