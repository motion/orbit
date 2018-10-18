import * as React from 'react'
import { OrbitAppProps } from '../../../types'
import { Markdown } from '../../../../views/Markdown'

export class DriveItem extends React.Component<OrbitAppProps<'drive'>> {
  render() {
    const { bit } = this.props
    return <Markdown source={bit.body} />
  }
}
