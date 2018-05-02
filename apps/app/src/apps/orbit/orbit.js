import * as React from 'react'
import { view } from '@mcro/black'
import OrbitDocked from './orbitDocked'
import OrbitContext from './orbitContext'
import OrbitStore from './orbitStore'

@view.attach('appStore')
@view.provide({
  orbitStore: OrbitStore,
})
@view
export default class Orbit {
  render() {
    return (
      <React.Fragment>
        <OrbitDocked />
        <OrbitContext />
      </React.Fragment>
    )
  }
}
