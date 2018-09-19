import { Logger } from '@mcro/logger'
import { Person, SlackBitData, SlackPersonData, SlackSettingValues } from '@mcro/models'
import { SettingEntity } from '../../entities/SettingEntity'
import { CommonUtils } from '../../utils/CommonUtils'
import { PersonUtils } from '../../utils/PersonUtils'
import { SlackUser } from '../../loaders/slack/SlackTypes'

/**
 * Creates a Slack Person.
 */
export class SlackPersonFactory {
  setting: SettingEntity

  constructor(setting: SettingEntity) {
    this.setting = setting
  }

  /**
   * Creates a single integration person from given Slack user.
   */
  create(user: SlackUser): Person {

    const id = CommonUtils.hash(`slack-${this.setting.id}-${user.id}`)
    const data: SlackPersonData = { tz: user.tz }
    const values = this.setting.values as SlackSettingValues

    return PersonUtils.create({
      id,
      setting: this.setting,
      integration: 'slack',
      integrationId: user.id,
      name: user.profile.real_name || user.name,
      data,
      raw: user,
      webLink: `https://${values.oauth.info.team.id}.slack.com/messages/${user.id}`,
      desktopLink: `slack://user?team=${values.oauth.info.team.id}&id=${user.id}`,
      email: user.profile.email,
      photo: user.profile.image_512,
    })
  }

}
