import { ConfluenceAuth } from './authViews/confluenceAuth'

export const allIntegrations = [
  {
    id: 'gmail',
    type: 'setting',
    integration: 'gmail',
    title: 'Google Mail',
    icon: 'gmail',
  },
  {
    id: 'gdocs',
    type: 'setting',
    integration: 'gdocs',
    title: 'Google Docs',
    icon: 'gdocs',
  },
  {
    id: 'github',
    type: 'setting',
    integration: 'github',
    title: 'Github',
    icon: 'github',
  },
  {
    id: 'slack',
    type: 'setting',
    integration: 'slack',
    title: 'Slack',
    icon: 'slack',
  },
  {
    id: 'confluence',
    type: 'setting',
    integration: 'confluence',
    title: 'Confluence',
    icon: 'confluence',
    auth: ConfluenceAuth,
  },
  {
    id: 'website',
    type: 'setting',
    integration: 'website',
    title: 'Website',
    icon: 'webpage',
    auth: false,
  },
  {
    id: 'folder',
    type: 'setting',
    integration: 'folder',
    title: 'Folder',
    icon: 'folder',
    auth: false,
  },
]

export const settingToResult = setting => ({
  id: setting.type,
  type: 'setting',
  integration: setting.type,
  icon: setting.type,
  title: (allIntegrations.find(x => x.integration === setting.type) || {})
    .title,
})
