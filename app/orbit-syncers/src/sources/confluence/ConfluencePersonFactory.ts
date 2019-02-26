import {
  ConfluencePersonData,
  ConfluenceSource,
  ConfluenceSourceValues,
  Person,
  PersonUtils,
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
      sourceType: 'confluence',
      source: this.source,
      userId: user.accountId,
      name: user.displayName,
      email: user.details.personal.email,
      photo: values.credentials.domain + user.profilePicture.path.replace('s=48', 's=512'),
      data: {} as ConfluencePersonData,
    })
  }
}
