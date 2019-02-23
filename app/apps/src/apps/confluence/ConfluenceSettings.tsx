import { OrbitSourceSettingProps } from '@mcro/kit'
import { AtlassianSource } from '@mcro/models'
import * as React from 'react'
import AtlassianSettingLogin from '../../views/AtlassianSettingLogin'

export function ConfluenceSettings(props: OrbitSourceSettingProps<AtlassianSource>) {
  return <AtlassianSettingLogin type="confluence" {...props} />
}
