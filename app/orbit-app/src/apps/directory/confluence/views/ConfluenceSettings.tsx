import * as React from 'react'
import { view } from '@mcro/black'
import { AtlassianSetting } from '@mcro/models'
import { OrbitAppSettingProps } from '../../../types'
import { SimpleAppExplorer } from '../../../views/SimpleAppExplorer'
import { AtlassianSettingLogin } from '../../../views/shared/AtlassianSettingLogin'

type Props = OrbitAppSettingProps<AtlassianSetting>

@view
export class ConfluenceSettings extends React.Component<Props> {
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
        settingsPane={<AtlassianSettingLogin type="confluence" setting={setting} />}
      />
    )
  }
}
