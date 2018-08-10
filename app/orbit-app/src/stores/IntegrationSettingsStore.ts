import { Setting } from '@mcro/models'
import { SettingRepository } from '../repositories'
import { modelQueryReaction } from '../repositories/modelQueryReaction'

export class IntegrationSettingsStore {
  settingsList?: Setting[] = modelQueryReaction(() =>
    SettingRepository.find({
      where: {
        token: { $not: '' },
      },
    }),
  )

  get settings() {
    if (!this.settingsList) {
      return null
    }
    return this.settingsList.reduce(
      (acc, cur) => ({ ...acc, [cur.type]: cur }),
      {},
    )
  }

  getTitle = (setting: Setting) => {
    const config = this.allIntegrations.find(
      x => x.integration === setting.type,
    )
    return config ? config.title : ''
  }

  settingToResult = (setting: Setting) => ({
    id: setting.id,
    type: 'setting',
    integration: setting.type,
    icon: setting.type,
    title: this.getTitle(setting),
  })

  allIntegrations = [
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
}
