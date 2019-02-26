import { AppDefinition } from '@mcro/kit'
import React from 'react'
import { AtlassianSettingLogin } from '../../views/AtlassianSettingLogin'
import { confluenceIcon } from './confluenceIcon'
import { ConfluenceSetup } from './ConfluenceSetup'

export const id = 'confluence'

export const app: AppDefinition = {
  name: 'Confluence',
  icon: confluenceIcon,
  itemType: 'markdown',
  sync: {
    sourceType: 'confluence',
    settings: props => <AtlassianSettingLogin type="confluence" {...props} />,
    setup: ConfluenceSetup,
  },
}
