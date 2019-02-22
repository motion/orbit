import { JiraPersonData, JiraSource, Person, PersonUtils } from '@mcro/models'
import { JiraUser } from '@mcro/services'

/**
 * Creates a Jira Person.
 */
export class JiraPersonFactory {
  private source: JiraSource

  constructor(source: JiraSource) {
    this.source = source
  }

  /**
   * Creates person entity from a given Jira user.
   */
  create(user: JiraUser): Person {
    return PersonUtils.create({
      Source: 'jira',
      source: this.source,
      SourceId: user.accountId,
      name: user.displayName,
      email: user.emailAddress,
      photo: user.avatarUrls['48x48'].replace('s=48', 's=512'),
      data: {} as JiraPersonData,
    })
  }
}
