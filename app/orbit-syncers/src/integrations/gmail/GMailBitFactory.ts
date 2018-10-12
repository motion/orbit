import { BitUtils } from '@mcro/model-utils'
import { Bit, GmailBitData, Setting } from '@mcro/models'
import { GMailThread } from '@mcro/services'
import { GMailMessageParser } from './GMailMessageParser'

/**
 * Creates a GMail Bit.
 */
export class GMailBitFactory {
  private setting: Setting

  constructor(setting: Setting) {
    this.setting = setting
  }

  /**
   * Creates a new bit from a given GMail thread.
   */
  create(thread: GMailThread): Bit {
    const body = thread.messages
      .map(message => {
        const parser = new GMailMessageParser(message)
        return parser.getTextBody()
      })
      .join('\r\n\r\n')

    const messages = thread.messages.map(message => {
      const parser = new GMailMessageParser(message)
      return {
        id: message.id,
        date: parser.getDate(),
        body: parser.getHtmlBody(),
        participants: parser.getParticipants(),
      }
    })

    const firstMessage = thread.messages[0]
    const lastMessage = thread.messages[thread.messages.length - 1]
    const firstMessageParser = new GMailMessageParser(firstMessage)
    const lastMessageParser = new GMailMessageParser(lastMessage)

    return BitUtils.create(
      {
        integration: 'gmail',
        type: 'mail',
        title: `${firstMessageParser.getTitle()}`,
        body,
        data: {
          messages,
        } as GmailBitData,
        // raw: thread,
        bitCreatedAt: firstMessageParser.getDate(),
        bitUpdatedAt: lastMessageParser.getDate(),
        webLink: 'https://mail.google.com/mail/u/0/#inbox/' + thread.id,
        settingId: this.setting.id,
      },
      thread.id,
    )
  }
}
