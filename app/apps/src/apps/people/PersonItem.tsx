import { OrbitItemViewProps } from '@mcro/kit'
import * as React from 'react'

export class PersonItem extends React.Component<OrbitItemViewProps<'people'>> {
  render() {
    return <div>im a person</div>
  }
}
