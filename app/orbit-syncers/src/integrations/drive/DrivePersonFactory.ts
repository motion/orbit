import { PersonUtils } from '@mcro/model-utils'
import { DrivePersonData, Person, Setting } from '@mcro/models'
import { DriveUser } from '@mcro/services'

/**
 * Creates a Drive Person.
 */
export class DrivePersonFactory {
  private setting: Setting

  constructor(setting: Setting) {
    this.setting = setting
  }

  /**
   * Creates person entity from a given Drive user.
   */
  create(user: DriveUser): Person {
    return PersonUtils.create({
      setting: this.setting,
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
