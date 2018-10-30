import { PersonUtils } from '@mcro/model-utils'
import { DrivePersonData, Person, DriveSource } from '@mcro/models'
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
      integrationId: user.emailAddress,
      integration: 'drive',
      name: user.displayName,
      email: user.emailAddress,
      photo: user.photoLink,
      data: {} as DrivePersonData,
      raw: user,
    })
  }
}
