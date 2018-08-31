import { IntegrationType } from '@mcro/models'

export const settingsList: {
  id: IntegrationType
  type: string
  integration: string
  title: string
  icon: string
}[] = [
  {
    id: 'gmail',
    type: 'setting',
    integration: 'gmail',
    title: 'Google Mail',
    icon: 'gmail',
  },
  {
    id: 'gdrive',
    type: 'setting',
    integration: 'gdrive',
    title: 'Google Drive',
    icon: 'gdrive',
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
    auth: true,
  },
  {
    id: 'jira',
    type: 'setting',
    integration: 'jira',
    title: 'Jira',
    icon: 'jira',
    auth: true,
  },
  // {
  //   id: 'website',
  //   type: 'setting',
  //   integration: 'website',
  //   title: 'Crawl Website',
  //   icon: 'webpage',
  //   auth: false,
  // },
  // {
  //   id: 'folder',
  //   type: 'setting',
  //   integration: 'folder',
  //   title: 'Folder',
  //   icon: 'folder',
  //   auth: false,
  // },
]
