import { createApi, createApp } from '@o/kit'
import { ConfluenceApi } from './api.node'
import { AtlassianSettingLogin } from './AtlassianSettingLogin'
import { confluenceIcon } from './confluenceIcon'

export default createApp({
  id: 'confluence',
  name: 'Confluence',
  icon: confluenceIcon,
  itemType: 'markdown',
  settings: AtlassianSettingLogin,
  setup: AtlassianSettingLogin,
  sync: {},
  api: createApi<typeof ConfluenceApi>(),
})
