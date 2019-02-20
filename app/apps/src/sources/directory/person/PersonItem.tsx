import * as React from 'react'
import { OrbitItemViewProps } from '../../types'

export class PersonItem extends React.Component<OrbitItemViewProps<'person'>> {
  render() {
    return <div>im a person</div>
  }
}
