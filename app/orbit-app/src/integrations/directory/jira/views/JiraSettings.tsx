import * as React from 'react'
import { view } from '@mcro/black'
import { AtlassianSetting } from '@mcro/models'
import { OrbitSourceSettingProps } from '../../../types'
import { SimpleAppExplorer } from '../../../views/apps/SimpleAppExplorer'
import { AtlassianSettingLogin } from '../../../views/shared/AtlassianSettingLogin'

type Props = OrbitSourceSettingProps<AtlassianSetting>

@view
export class JiraSources extends React.Component<Props> {
  render() {
    const {
      setting,
      appConfig: {
        viewConfig: { initialState },
      },
    } = this.props
    return (
      <SimpleAppExplorer
        setting={setting}
        initialState={initialState}
        settingsPane={<AtlassianSettingLogin type="jira" setting={setting} />}
      />
    )
  }
}
