import * as React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'

@view
export class Root extends React.Component {
  render() {
    return (
      <root>
        <UI.Button size={2}>Hello world</UI.Button>
        <thing>wtf</thing>
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
