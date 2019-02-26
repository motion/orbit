import { Logger } from '@mcro/logger'
import {
  Bit,
  BitEntity,
  BitUtils,
  GmailBitData,
  GmailBitDataParticipant,
  GmailSource,
  SourceEntity,
} from '@mcro/models'
import { GMailLoader, GMailThread } from '@mcro/services'
import { sleep } from '@mcro/utils'
import { chunk } from 'lodash'
import { getRepository, In } from 'typeorm'
import { SourceSyncer } from '../../core/SourceSyncer'
import { checkCancelled } from '../../resolvers/SourceForceCancelResolver'
import { GMailMessageParser } from './GMailMessageParser'

/**
 * Syncs GMail.
 */
export class GMailSyncer implements SourceSyncer {
  private log: Logger
  private source: GmailSource
  private loader: GMailLoader

  constructor(source: GmailSource, log?: Logger) {
    this.source = source
    this.log = log || new Logger('syncer:gmail:' + source.id)
    this.loader = new GMailLoader(source, this.log, source =>
      getRepository(SourceEntity).save(source),
    )
  }

  async run() {
    this.log.info('sync gmail based on settings', this.source.values)

    // setup default source configuration values
    if (!this.source.values.lastSync) this.source.values.lastSync = {}
    if (!this.source.values.max) this.source.values.max = 10000
    if (!this.source.values.daysLimit) this.source.values.daysLimit = 330

    // setup some local variables we are gonna work with
    const queryFilter = this.source.values.filter || `newer_than:${this.source.values.daysLimit}d`
    let lastSync = this.source.values.lastSync

    // update last sync configuration
    this.log.info('updating sync sources')
    lastSync.usedQueryFilter = queryFilter
    lastSync.usedDaysLimit = this.source.values.daysLimit
    lastSync.usedMax = this.source.values.max
    await getRepository(SourceEntity).save(this.source, { listeners: false })

    // if user configuration has changed (max number of messages, days limitation or query filter)
    // we drop all bits to make complete sync again
    if (
      (lastSync.usedMax !== undefined && this.source.values.max !== lastSync.usedMax) ||
      (lastSync.usedQueryFilter !== undefined && queryFilter !== lastSync.usedQueryFilter) ||
      (lastSync.usedDaysLimit !== undefined &&
        this.source.values.daysLimit !== lastSync.usedDaysLimit)
    ) {
      this.log.info(
        'last syncronization configuration mismatch, dropping bits and start sync from scratch',
      )
      await getRepository(BitEntity).delete({ sourceId: this.source.id }) // todo: drop people as well
      this.source.values.lastSync = lastSync = {}
    }

    // we if we have last history id it means we already did a complete sync and now we are using
    // gmail's history api to get email events information and sync based on this information
    if (lastSync.historyId) {
      // load history
      const history = await this.loader.loadHistory(lastSync.historyId)

      // load threads for newly added / changed threads
      if (history.addedThreadIds.length) {
        this.log.timer('found added/changed messages in history', history.addedThreadIds)

        // convert added thread ids into thread objects and load their messages
        const addedThreads = await Promise.all(
          history.addedThreadIds.map(async threadId => {
            return {
              id: threadId,
              historyId: history.historyId,
            } as GMailThread
          }),
        )
        await this.loader.loadMessages(addedThreads)

        // sync threads
        for (let thread of addedThreads) {
          await checkCancelled(this.source.id)
          // prevent burning too much CPU
          await sleep(10)
          await this.syncThread(thread)
        }

        this.log.timer('found added or changed messages in history')
      } else {
        this.log.info('no added or changed messages in history were found')
      }

      // load bits for removed threads and remove them
      if (history.removedThreadIds.length) {
        this.log.info('found actions in history for thread removals', history.removedThreadIds)
        const removedBits = await getRepository(BitEntity).find({
          sourceId: this.source.id,
          id: In(history.removedThreadIds.map(threadId => BitUtils.id(this.source, threadId))),
        })
        this.log.info('found bits to be removed, removing', removedBits)
        await getRepository(BitEntity).remove(removedBits) // todo: we also need to remove people
      } else {
        this.log.info('no removed messages in history were found')
      }

      lastSync.historyId = history.historyId
      await getRepository(SourceEntity).save(this.source, { listeners: false })
    } else {
      // else this is a first time sync, load all threads
      this.log.timer('sync all threads')

      await this.loader.loadThreads({
        count: this.source.values.max,
        queryFilter: queryFilter,
        pageToken: lastSync.lastCursor,
        loadedCount: lastSync.lastCursorLoadedCount || 0,
        handler: this.handleThread.bind(this),
      })
      this.log.timer('sync all threads')
    }

    // load emails for whitelisted people separately
    // we don't make this operation on a first sync because we can miss newly added emails
    // this operation is relatively cheap, so for now we are okay with it
    if (this.source.values.whitelist) {
      this.log.info('checking whitelist', this.source.values.whitelist)
      const whitelistEmails = Object.keys(this.source.values.whitelist).filter(
        email => this.source.values.whitelist[email] === true,
      )

      if (whitelistEmails.length > 0) {
        this.log.timer('load threads from whitelisted people', whitelistEmails)
        // we split emails into chunks because gmail api can't handle huge queries
        const emailChunks = chunk(whitelistEmails, 100)
        for (let emails of emailChunks) {
          const whitelistFilter = emails.map(email => 'from:' + email).join(' OR ')
          await this.loader.loadThreads({
            count: this.source.values.max,
            queryFilter: whitelistFilter,
            loadedCount: 0,
            handler: this.syncThread.bind(this),
          })
        }
        this.log.timer('load threads from whitelisted people')
      } else {
        this.log.info('no enabled people in whitelist were found')
      }
    }
  }

  /**
   * Handles a single thread.
   */
  private async handleThread(
    thread: GMailThread,
    cursor?: string,
    loadedCount?: number,
    isLast?: boolean,
  ) {
    const lastSync = this.source.values.lastSync

    // for the first ever synced thread we store its history id, and once sync is done,
    // we use this history to id to load further newly added or removed messages
    if (!lastSync.lastCursorHistoryId) {
      lastSync.lastCursorHistoryId = thread.historyId
      this.log.info('looks like its the first syncing thread, set history id', lastSync)
      await getRepository(SourceEntity).save(this.source, { listeners: false })
    }

    // sync a thread
    await this.syncThread(thread)

    // in the case if its the last thread we need to cleanup last cursor stuff and save last synced date
    if (isLast) {
      this.log.info(
        'looks like its the last thread in this sync, removing last cursor and source last sync date',
        lastSync,
      )
      lastSync.historyId = lastSync.lastCursorHistoryId
      lastSync.lastCursor = undefined
      lastSync.lastCursorHistoryId = undefined
      lastSync.lastCursorLoadedCount = undefined
      await getRepository(SourceEntity).save(this.source, { listeners: false })
      return true
    }

    // update last sync settings to make sure we continue from the last point in the case if application will stop
    if (lastSync.lastCursor !== cursor) {
      this.log.info('updating last cursor in settings', { cursor })
      lastSync.lastCursor = cursor
      lastSync.lastCursorLoadedCount = loadedCount
      await getRepository(SourceEntity).save(this.source, { listeners: false })
    }

    return true
  }

  /**
   * Syncs a given thread.
   */
  private async syncThread(thread: GMailThread) {
    const participants = this.extractThreadParticipants(thread)
    const bit = this.createMailBit(thread)

    // if email doesn't have body messages we don't need to sync it
    if (!bit) return

    bit.people = participants.map(participant => this.createPersonBit(participant))

    this.log.verbose('syncing', { thread, bit, people: bit.people })
    await getRepository(BitEntity).save(bit.people, { listeners: false })
    await getRepository(BitEntity).save(bit, { listeners: false })
  }

  /**
   * Extracts all participants from a given gmail threads.
   */
  private extractThreadParticipants(thread: GMailThread): GmailBitDataParticipant[] {
    const allParticipants: GmailBitDataParticipant[] = []
    for (let message of thread.messages) {
      const parser = new GMailMessageParser(message)
      const participants = parser.getParticipants()
      for (let participant of participants) {
        const inAllParticipant = allParticipants.find(p => p.email === participant.email)
        if (inAllParticipant) {
          if (!inAllParticipant.name && participant.name) inAllParticipant.name = participant.name
        } else {
          allParticipants.push(participant)
        }
      }
    }
    return allParticipants
  }

  /**
   * Creates a new bit from a given GMail thread.
   */
  private createMailBit(thread: GMailThread): Bit | undefined {
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

    return BitUtils.create(
      {
        sourceType: 'gmail',
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

  /**
   * Creates a new person from a given GMail thread participant.
   */
  createPersonBit(participant: GmailBitDataParticipant): Bit {
    return BitUtils.create(
      {
        sourceType: 'gmail',
        sourceId: this.source.id,
        type: 'person',
        originalId: participant.email,
        title: participant.name || '',
        webLink: 'mailto:' + participant.email,
        desktopLink: 'mailto:' + participant.email,
        email: participant.email,
      },
      participant.email,
    )
  }

}
