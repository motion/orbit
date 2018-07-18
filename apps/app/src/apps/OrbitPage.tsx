import * as React from 'react'
import { view } from '@mcro/black'
import { OrbitDocked } from './orbit/OrbitDocked'
// import OrbitContext from './orbit/orbitContext'
import { OrbitStore } from './orbit/OrbitStore'
import { NLPStore } from '../stores/NLPStore'

@view.attach('appStore')
@view.provide({
  orbitStore: OrbitStore,
})
@view.provide({
  nlpStore: NLPStore,
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
