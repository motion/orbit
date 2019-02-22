import { OrbitSourceSettingProps } from '@mcro/kit'
import { AtlassianSource } from '@mcro/models'
import * as React from 'react'
import AtlassianSettingLogin from '../../../views/AtlassianSettingLogin'

type Props = OrbitSourceSettingProps<AtlassianSource>

export class ConfluenceSettings extends React.Component<Props> {
  render() {
    const { source } = this.props
    return <AtlassianSettingLogin type="confluence" source={source} />
  }
}
