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
  private setting: ConfluenceSource

  constructor(setting: ConfluenceSource) {
    this.setting = setting
  }

  /**
   * Creates person entity from a given Confluence user.
   */
  create(user: ConfluenceUser): Person {
    const values = this.setting.values as ConfluenceSourceValues
    return PersonUtils.create({
      integration: 'confluence',
      setting: this.setting,
      integrationId: user.accountId,
      name: user.displayName,
      email: user.details.personal.email,
      photo: values.credentials.domain + user.profilePicture.path.replace('s=48', 's=512'),
      raw: user,
      data: {} as ConfluencePersonData,
    })
  }
}
