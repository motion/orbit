import { AppDefinition } from '@mcro/kit'
import React from 'react'
import { AtlassianSettingLogin } from '../../views/AtlassianSettingLogin'
import { confluenceIcon } from './confluenceIcon'
import { ConfluenceSetup } from './ConfluenceSetup'

export const ConfluenceApp: AppDefinition = {
  id: 'confluence',
  name: 'Confluence',
  icon: confluenceIcon,
  itemType: 'markdown',
  settings: props => <AtlassianSettingLogin identifier="confluence" {...props} />,
  setup: ConfluenceSetup,
  sync: {},
}
