import { Bit } from '@o/kit'
import { WorkerUtilsInstance } from '@o/worker-kit'

import { GMailMessageParser } from './GMailMessageParser'
import { GmailBitData, GmailBitDataParticipant, GMailThread } from './GMailModels'

/**
 * Creates bits out of gmail models.
 */
export class GMailBitFactory {
  constructor(private utils: WorkerUtilsInstance) {}

  /**
   * Creates a new bit from a given GMail thread.
   */
  createMailBit(thread: GMailThread): Bit | undefined {
    const body = thread.messages
      .map(message => {
        const parser = new GMailMessageParser(message)
        return parser.getTextBody()
      })
      .join('\r\n\r\n')

    // in the case if body is not defined (e.g. message without content)
    // we return undefined - to skip bit creation, we don't need bits with empty body
    if (!body) return undefined

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
    if (!title && firstMessage.labelIds.indexOf('CHAT') !== -1) {
      const participantNames: string[] = []
      for (let message of messages) {
        for (let participant of message.participants) {
          participantNames.push(participant.name ? participant.name : participant.email)
        }
      }
      title = 'Chat with ' + participantNames.join(', ')
    }

    // if we still have no title then skip this email
    if (!title) return undefined

    return this.utils.createBit({
      type: 'thread',
      originalId: thread.id,
      title,
      body,
      data: {
        messages,
      } as GmailBitData,
      bitCreatedAt: firstMessageParser.getDate(),
      bitUpdatedAt: lastMessageParser.getDate(),
      webLink: 'https://mail.google.com/mail/u/0/#inbox/' + thread.id,
    })
  }

  /**
   * Creates a new person from a given GMail thread participant.
   */
  createPersonBit(participant: GmailBitDataParticipant): Bit {
    return this.utils.createBit({
      type: 'person',
      originalId: participant.email,
      title: participant.name || participant.email || '',
      webLink: 'mailto:' + participant.email,
      desktopLink: 'mailto:' + participant.email,
      email: participant.email,
    })
  }
}
