import { DrivePersonData, DriveSource, Person, PersonUtils } from '@mcro/models'
import { DriveUser } from '@mcro/services'

/**
 * Creates a Drive Person.
 */
export class DrivePersonFactory {
  private source: DriveSource

  constructor(source: DriveSource) {
    this.source = source
  }

  /**
   * Creates person entity from a given Drive user.
   */
  create(user: DriveUser): Person {
    return PersonUtils.create({
      source: this.source,
      userId: user.emailAddress,
      sourceType: 'drive',
      name: user.displayName,
      email: user.emailAddress,
      photo: user.photoLink,
      data: {} as DrivePersonData,
    })
  }
}
