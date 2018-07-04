import * as React from 'react'
import { view } from '@mcro/black'
import { OrbitIcon } from '../../../orbit/orbitIcon'
import { SubTitle } from '../../../../views'

@view
export class ConfluenceSetting extends React.Component {
  render() {
    return (
      <container>
        <inner>
          <SubTitle css={{ textAlign: 'center' }}>All good!</SubTitle>
          <OrbitIcon icon="confluence" size={256} />
        </inner>
      </container>
    )
  }

  static style = {
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
  }
}
