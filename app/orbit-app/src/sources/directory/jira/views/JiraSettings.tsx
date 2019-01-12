import * as React from 'react'
import { AtlassianSource } from '@mcro/models'
import { OrbitSourceSettingProps } from '../../../types'
import { AtlassianSettingLogin } from '../../../views/shared/AtlassianSettingLogin'

type Props = OrbitSourceSettingProps<AtlassianSource>

export class JiraSettings extends React.Component<Props> {
  render() {
    const { source } = this.props
    return <AtlassianSettingLogin type="jira" source={source} />
  }
}
