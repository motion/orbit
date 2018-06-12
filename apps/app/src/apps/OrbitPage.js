import * as React from 'react'
import { view } from '@mcro/black'
import OrbitDocked from './orbit/orbitDocked'
// import OrbitContext from './orbit/orbitContext'
import OrbitStore from './orbit/orbitStore'

@view.attach('appStore')
@view.provide({
  orbitStore: OrbitStore,
})
@view
export class OrbitPage {
  render() {
    return (
      <>
        <OrbitDocked />
        {/* <OrbitContext /> */}
      </>
    )
  }
}
