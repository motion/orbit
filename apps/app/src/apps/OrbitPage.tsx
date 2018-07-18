import * as React from 'react'
import { view } from '@mcro/black'
import { OrbitDocked } from './orbit/OrbitDocked'
// import OrbitContext from './orbit/orbitContext'
import { OrbitStore } from './orbit/OrbitStore'

@view.attach('appStore')
@view.provide({
  orbitStore: OrbitStore,
})
@view
export class OrbitPage extends React.Component {
  render() {
    return (
      <>
        <OrbitDocked />
        {/* <OrbitContext /> */}
      </>
    )
  }
}
