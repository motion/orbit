import { OrbitItemViewProps } from '@mcro/kit'
import * as React from 'react'

export class PersonItem extends React.Component<OrbitItemViewProps<'person'>> {
  render() {
    return <div>im a person</div>
  }
}
