import * as React from 'react'
import { OrbitGenericAppProps } from '../../types'

export class PersonItem extends React.Component<OrbitGenericAppProps<'person'>> {
  render() {
    return <div>im a person</div>
  }
}
