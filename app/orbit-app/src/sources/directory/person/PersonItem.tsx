import * as React from 'react'
import { OrbitIntegrationProps } from '../../types'

export class PersonItem extends React.Component<OrbitIntegrationProps<'person'>> {
  render() {
    return <div>im a person</div>
  }
}
