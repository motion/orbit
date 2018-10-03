import { PersonUtils } from '@mcro/model-utils'
import { JiraPersonData, Person, Setting } from '@mcro/models'
import { JiraUser } from '@mcro/services'

/**
 * Creates a Jira Person.
 */
export class JiraPersonFactory {
  private setting: Setting

  constructor(setting: Setting) {
    this.setting = setting
  }

  /**
   * Creates person entity from a given Jira user.
   */
  create(user: JiraUser): Person {
    return PersonUtils.create({
      integration: 'jira',
      setting: this.setting,
      integrationId: user.accountId,
      name: user.displayName,
      email: user.emailAddress,
      photo: user.avatarUrls['48x48'].replace('s=48', 's=512'),
      data: {} as JiraPersonData,
      raw: user,
    })
  }

}
