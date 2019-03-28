import { createApp } from '@o/kit'
import React from 'react'
import { confluenceIcon } from './confluenceIcon'
import { ConfluenceSetup } from './ConfluenceSetup'
import { AtlassianSettingLogin } from './AtlassianSettingLogin'
import { createApi } from '@o/kit'
import { ConfluenceApi } from './api.node'

export default createApp({
  id: 'confluence',
  name: 'Confluence',
  icon: confluenceIcon,
  itemType: 'markdown',
  settings: props => <AtlassianSettingLogin identifier="confluence" {...props} />,
  setup: ConfluenceSetup,
  sync: {},
  api: createApi<typeof ConfluenceApi>(),
})
