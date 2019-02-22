import {
  GmailBitDataParticipant,
  GmailPersonData,
  GmailSource,
  Person,
  PersonUtils,
} from '@mcro/models'

/**
 * Creates a GMail Person.
 */
export class GMailPersonFactory {
  private source: GmailSource

  constructor(source: GmailSource) {
    this.source = source
  }

  /**
   * Creates a new person from a given GMail thread participant.
   */
  create(participant: GmailBitDataParticipant): Person {
    return PersonUtils.create({
      userId: participant.email,
      sourceType: 'gmail',
      name: participant.name || '',
      sourceId: this.source.id,
      webLink: 'mailto:' + participant.email,
      desktopLink: 'mailto:' + participant.email,
      email: participant.email,
      data: {} as GmailPersonData,
    })
  }
}
