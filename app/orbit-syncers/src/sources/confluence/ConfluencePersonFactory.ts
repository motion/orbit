import { PersonUtils } from '@mcro/model-utils'
import {
  ConfluencePersonData,
  ConfluenceSourceValues,
  Person,
  ConfluenceSource,
} from '@mcro/models'
import { ConfluenceUser } from '@mcro/services'

/**
 * Creates a Confluence Person.
 */
export class ConfluencePersonFactory {
  private source: ConfluenceSource

  constructor(source: ConfluenceSource) {
    this.source = source
  }

  /**
   * Creates person entity from a given Confluence user.
   */
  create(user: ConfluenceUser): Person {
    const values = this.source.values as ConfluenceSourceValues
    return PersonUtils.create({
      integration: 'confluence',
      source: this.source,
      integrationId: user.accountId,
      name: user.displayName,
      email: user.details.personal.email,
      photo: values.credentials.domain + user.profilePicture.path.replace('s=48', 's=512'),
      data: {} as ConfluencePersonData,
    })
  }
}
