import * as React from 'react'
import { view } from '@mcro/black'
import { AtlassianSettingLogin } from './AtlassianSettingLogin'
import { AtlassianSetting } from '@mcro/models'
import { PeekSettingProps } from '../PeekSetting'
import { SimpleAppExplorer } from './views/SimpleAppExplorer'

type Props = PeekSettingProps<AtlassianSetting>

@view
export class JiraSetting extends React.Component<Props> {
  render() {
    const { setting } = this.props
    return (
      <SimpleAppExplorer
        setting={setting}
        settingsPane={<AtlassianSettingLogin type="jira" setting={setting} />}
      />
    )
  }
}
