import * as React from 'react'
import { view } from '@mcro/black'
import { AtlassianSource } from '@mcro/models'
import { OrbitSourceSettingProps } from '../../../types'
import { SimpleAppExplorer } from '../../../views/apps/SimpleAppExplorer'
import { AtlassianSettingLogin } from '../../../views/shared/AtlassianSettingLogin'

type Props = OrbitSourceSettingProps<AtlassianSource>

@view
export class ConfluenceSettings extends React.Component<Props> {
  render() {
    const {
      source,
      appConfig: {
        viewConfig: { initialState },
      },
    } = this.props
    return (
      <SimpleAppExplorer
        source={source}
        initialState={initialState}
        sourcesPane={<AtlassianSettingLogin type="confluence" source={source} />}
      />
    )
  }
}
