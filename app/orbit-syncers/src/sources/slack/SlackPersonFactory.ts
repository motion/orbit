import { Person, PersonUtils, SlackPersonData, SlackSource } from '@mcro/models'
import { SlackTeam, SlackUser } from '@mcro/services'

/**
 * Creates a Slack Person.
 */
export class SlackPersonFactory {
  private source: SlackSource

  constructor(source: SlackSource) {
    this.source = source
  }

  /**
   * Creates a single source person from given Slack user.
   */
  create(user: SlackUser, team: SlackTeam): Person {
    return PersonUtils.create({
      source: this.source,
      sourceType: 'slack',
      userId: user.id,
      name: user.profile.real_name || user.name,
      data: { tz: user.tz, team: user.team_id } as SlackPersonData,
      webLink: `https://${team.domain}.slack.com/messages/${user.id}`,
      desktopLink: `slack://user?team=${team.id}&id=${user.id}`,
      email: user.profile.email,
      photo: user.profile.image_512,
    })
  }
}
