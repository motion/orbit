import { PersonUtils } from '@mcro/model-utils'
import { GmailBitDataParticipant, GmailPersonData, Person, GmailSource } from '@mcro/models'

/**
 * Creates a GMail Person.
 */
export class GMailPersonFactory {
  private setting: GmailSource

  constructor(setting: GmailSource) {
    this.setting = setting
  }

  /**
   * Creates a new person from a given GMail thread participant.
   */
  create(participant: GmailBitDataParticipant): Person {
    return PersonUtils.create({
      integrationId: participant.email,
      integration: 'gmail',
      name: participant.name || '',
      settingId: this.setting.id,
      webLink: 'mailto:' + participant.email,
      desktopLink: 'mailto:' + participant.email,
      email: participant.email,
      data: {} as GmailPersonData,
      raw: participant,
    })
  }
}
