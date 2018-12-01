import { BitUtils } from '@mcro/models'
import { Bit, GmailBitData, GmailSource } from '@mcro/models'
import { GMailThread } from '@mcro/services'
import { GMailMessageParser } from './GMailMessageParser'

/**
 * Creates a GMail Bit.
 */
export class GMailBitFactory {
  private source: GmailSource

  constructor(source: GmailSource) {
    this.source = source
  }

  /**
   * Creates a new bit from a given GMail thread.
   */
  create(thread: GMailThread): Bit|undefined {
    const body = thread.messages
      .map(message => {
        const parser = new GMailMessageParser(message)
        return parser.getTextBody()
      })
      .join('\r\n\r\n')

    // in the case if body is not defined (e.g. message without content)
    // we return undefined - to skip bit creation, we don't need bits with empty body
    if (!body)
      return undefined

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
    let title = firstMessageParser.getTitle()

    // if there is no title it can be a hangouts conversation, check if it is and generate a title
    if (!title && firstMessage.labelIds.indexOf("CHAT") !== -1) {
      const participantNames: string[] = []
      for (let message of messages) {
        for (let participant of message.participants) {
          participantNames.push(participant.name ? participant.name : participant.email)
        }
      }
      title = 'Chat with ' + participantNames.join(", ")
    }

    // if we still have no title then skip this email
    if (!title)
      return undefined

    return BitUtils.create(
      {
        integration: 'gmail',
        sourceId: this.source.id,
        type: 'mail',
        title,
        body,
        data: {
          messages,
        } as GmailBitData,
        bitCreatedAt: firstMessageParser.getDate(),
        bitUpdatedAt: lastMessageParser.getDate(),
        webLink: 'https://mail.google.com/mail/u/0/#inbox/' + thread.id,
      },
      thread.id,
    )
  }
}
