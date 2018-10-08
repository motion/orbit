import { PersonUtils } from '@mcro/model-utils'
import { Person, Setting, SlackPersonData } from '@mcro/models'
import { SlackUser, SlackTeam } from '@mcro/services'

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
  create(user: SlackUser, team: SlackTeam): Person {
    return PersonUtils.create({
      setting: this.setting,
      integration: 'slack',
      integrationId: user.id,
      name: user.profile.real_name || user.name,
      data: { tz: user.tz, team: user.team_id } as SlackPersonData,
      raw: user,
      webLink: `https://${team.domain}.slack.com/messages/${user.id}`,
      desktopLink: `slack://user?team=${team.id}&id=${user.id}`,
      email: user.profile.email,
      photo: user.profile.image_512,
    })
  }
}
