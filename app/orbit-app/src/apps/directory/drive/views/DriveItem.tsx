import * as React from 'react'
import { OrbitIntegrationProps } from '../../../types'
import { Markdown } from '../../../../views/Markdown'

export class DriveItem extends React.Component<OrbitIntegrationProps<'drive'>> {
  render() {
    const { bit } = this.props
    return <Markdown source={bit.body} />
  }
}
