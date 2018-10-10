import { Unpad } from '../../../../views/Unpad'
import { OrbitSearchMasonry } from './OrbitSearchMasonry'
import { OrbitSearchQuickResults } from '../orbitSearch/OrbitSearchQuickResults'
import * as React from 'react'
import { view } from '@mcro/black'
import { VerticalSpace } from '../../../../views'

@view
export class OrbitSearch extends React.Component {
  render() {
    return (
      <>
        <Unpad>
          <OrbitSearchQuickResults />
          <OrbitSearchMasonry />
        </Unpad>
        <VerticalSpace />
      </>
    )
  }
}
