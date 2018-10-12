import { IntegrationType } from '@mcro/models'
import { AppConfig } from '@mcro/stores'

type SettingConfig = AppConfig & { id: IntegrationType }

export const settingsList: SettingConfig[] = [
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
    type: 'view',
    subType: 'ConfluenceSetupPane',
    integration: 'confluence',
    title: 'Confluence',
    icon: 'confluence',
  },
  {
    id: 'jira',
    type: 'view',
    subType: 'JiraSetupPane',
    integration: 'jira',
    title: 'Jira',
    icon: 'jira',
  },
  {
    id: 'website',
    type: 'view',
    subType: 'WebsiteSetupPane',
    integration: 'website',
    title: 'Crawl Website',
    icon: 'website',
    // auth: false,
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
