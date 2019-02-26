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
  sync: {
    settings: props => <AtlassianSettingLogin type="confluence" {...props} />,
    setup: ConfluenceSetup,
  },
}
