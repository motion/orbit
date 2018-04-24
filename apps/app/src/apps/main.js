import * as React from 'react'
import Highlights from './highlights/highlights'
import Orbit from './orbit/orbit'
import Peek from './peek/peek'

export default class OrbitMain extends React.Component {
  render() {
    return (
      <main>
        <Highlights />
        <Orbit />
        <Peek />
      </main>
    )
  }

  static style = {
    main: {
      width: '100%',
      height: '100%',
      pointerEvents: 'none',
      userSelect: 'none',
      position: 'relative',
    },
  }
}
