import * as React from 'react'
import { view } from '@mcro/black'
import { AtlassianSource } from '@mcro/models'
import { OrbitSourceSettingProps } from '../../../types'
import { AtlassianSettingLogin } from '../../../views/shared/AtlassianSettingLogin'

type Props = OrbitSourceSettingProps<AtlassianSource>

@view
export class ConfluenceSettings extends React.Component<Props> {
  render() {
    const { source } = this.props
    return <AtlassianSettingLogin type="confluence" source={source} />
  }
}
