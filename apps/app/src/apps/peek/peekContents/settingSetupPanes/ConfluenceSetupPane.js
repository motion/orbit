import * as React from 'react'
import { view } from '@mcro/black'
import { AtlassianSettingLogin } from '../settingPanes/AtlassianSettingLogin'

@view
export class ConfluenceSetupPane extends React.Component {
  render() {
    return <AtlassianSettingLogin type="confluence" />
  }
}
