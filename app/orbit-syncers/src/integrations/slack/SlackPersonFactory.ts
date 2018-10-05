import { PersonUtils } from '@mcro/model-utils'
import { Person, Setting, SlackPersonData, SlackSettingValues } from '@mcro/models'
import { SlackUser } from '@mcro/services'

/**
 * Creates a Slack Person.
 */
export class SlackPersonFactory {
  setting: Setting

  constructor(setting: Setting) {
    this.setting = setting
  }

  /**
   * Creates a single integration person from given Slack user.
   */
  create(user: SlackUser): Person {
    const values = this.setting.values as SlackSettingValues
    return PersonUtils.create({
      setting: this.setting,
      integration: 'slack',
      integrationId: user.id,
      name: user.profile.real_name || user.name,
      data: { tz: user.tz } as SlackPersonData,
      raw: user,
      webLink: `https://${values.team.id}.slack.com/messages/${user.id}`,
      desktopLink: `slack://user?team=${values.team.id}&id=${user.id}`,
      email: user.profile.email,
      photo: user.profile.image_512,
    })
  }

}
