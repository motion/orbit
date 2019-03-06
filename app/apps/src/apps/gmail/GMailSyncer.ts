import { AppEntity, Bit, BitEntity } from '@mcro/models'
import { BitUtils, createSyncer, getEntityManager, isAborted } from '@mcro/sync-kit'
import { sleep } from '@mcro/utils'
import { chunk } from 'lodash'
import { In } from 'typeorm'
import { GmailAppData } from './GmailAppData'
import { GmailBitData, GmailBitDataParticipant } from './GmailBitData'
import { GMailLoader } from './GMailLoader'
import { GMailMessageParser } from './GMailMessageParser'
import { GMailThread } from './GMailTypes'

/**
 * Syncs GMail.
 */
export const GMailSyncer = createSyncer(async ({ app, log }) => {
  const data: GmailAppData = app.data
  const loader = new GMailLoader(app, log, source =>
    getEntityManager()
      .getRepository(AppEntity)
      .save(source),
  )

  /**
   * Handles a single thread.
   */
  const handleThread = async (
    thread: GMailThread,
    cursor?: string,
    loadedCount?: number,
    isLast?: boolean,
  ) => {
    const lastSync = data.values.lastSync

    // for the first ever synced thread we store its history id, and once sync is done,
    // we use this history to id to load further newly added or removed messages
    if (!lastSync.lastCursorHistoryId) {
      lastSync.lastCursorHistoryId = thread.historyId
      log.info('looks like its the first syncing thread, set history id', lastSync)
      await getEntityManager()
        .getRepository(AppEntity)
        .save(app, { listeners: false })
    }

    // sync a thread
    await syncThread(thread)

    // in the case if its the last thread we need to cleanup last cursor stuff and save last synced date
    if (isLast) {
      log.info(
        'looks like its the last thread in this sync, removing last cursor and source last sync date',
        lastSync,
      )
      lastSync.historyId = lastSync.lastCursorHistoryId
      lastSync.lastCursor = undefined
      lastSync.lastCursorHistoryId = undefined
      lastSync.lastCursorLoadedCount = undefined
      await getEntityManager()
        .getRepository(AppEntity)
        .save(app, { listeners: false })
      return true
    }

    // update last sync settings to make sure we continue from the last point in the case if application will stop
    if (lastSync.lastCursor !== cursor) {
      log.info('updating last cursor in settings', { cursor })
      lastSync.lastCursor = cursor
      lastSync.lastCursorLoadedCount = loadedCount
      await getEntityManager()
        .getRepository(AppEntity)
        .save(app, { listeners: false })
    }

    return true
  }

  /**
   * Syncs a given thread.
   */
  const syncThread = async (thread: GMailThread) => {
    const participants = extractThreadParticipants(thread)
    const bit = createMailBit(thread)

    // if email doesn't have body messages we don't need to sync it
    if (!bit) return

    bit.people = participants.map(participant => createPersonBit(participant))

    log.verbose('syncing', { thread, bit, people: bit.people })
    await getEntityManager()
      .getRepository(BitEntity)
      .save(bit.people, { listeners: false })
    await getEntityManager()
      .getRepository(BitEntity)
      .save(bit, { listeners: false })
  }

  /**
   * Extracts all participants from a given gmail threads.
   */
  const extractThreadParticipants = (thread: GMailThread): GmailBitDataParticipant[] => {
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
  const createMailBit = (thread: GMailThread): Bit | undefined => {
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
        appIdentifier: 'gmail',
        appId: app.id,
        type: 'thread',
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
  const createPersonBit = (participant: GmailBitDataParticipant): Bit => {
    return BitUtils.create(
      {
        appIdentifier: 'gmail',
        appId: app.id,
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

  // mail whitelister

  // load person because we need emails that we want to whitelist
  log.info('loading person bits')
  const people = await getEntityManager()
    .getRepository(BitEntity)
    .find({
      where: {
        type: 'person',
        appIdentifier: ['slack', 'github', 'drive', 'jira', 'confluence'],
      },
    })
  log.info('person bits were loaded', people)
  const emails = people.map(person => person.email).filter(email => email.indexOf('@') !== -1)
  log.info('emails from the person bits', emails)

  // next we find all gmail Apps to add those emails to their whitelists
  log.info('loading gmail Apps')
  const Apps = await getEntityManager()
    .getRepository(AppEntity)
    .find({
      where: { identifier: 'gmail' },
    })
  log.info('loaded gmail Apps', Apps)

  // update whitelist settings in Apps
  const newWhiteListedEmails: string[] = []
  for (let App of Apps) {
    const values = App.data.values as GmailAppData['values']
    const foundEmails = values.foundEmails || []
    const whitelist = {}
    for (let email of emails) {
      if (foundEmails.indexOf(email) === -1) {
        whitelist[email] = true
        newWhiteListedEmails.push(email)
      }
    }
    values.whitelist = whitelist
    await getEntityManager()
      .getRepository(AppEntity)
      .save(App)
  }
  log.info('newly whitelisted emails', newWhiteListedEmails)

  // gmail sync

  log.info('sync gmail based on settings', data.values)

  // setup default source configuration values
  if (!data.values.lastSync) data.values.lastSync = {}
  if (!data.values.max) data.values.max = 10000
  if (!data.values.daysLimit) data.values.daysLimit = 330

  // setup some local variables we are gonna work with
  const queryFilter = data.values.filter || `newer_than:${data.values.daysLimit}d`
  let lastSync = data.values.lastSync

  // update last sync configuration
  log.info('updating sync sources')
  lastSync.usedQueryFilter = queryFilter
  lastSync.usedDaysLimit = data.values.daysLimit
  lastSync.usedMax = data.values.max
  await getEntityManager()
    .getRepository(AppEntity)
    .save(app, { listeners: false })

  // if user configuration has changed (max number of messages, days limitation or query filter)
  // we drop all bits to make complete sync again
  if (
    (lastSync.usedMax !== undefined && data.values.max !== lastSync.usedMax) ||
    (lastSync.usedQueryFilter !== undefined && queryFilter !== lastSync.usedQueryFilter) ||
    (lastSync.usedDaysLimit !== undefined && data.values.daysLimit !== lastSync.usedDaysLimit)
  ) {
    log.info(
      'last syncronization configuration mismatch, dropping bits and start sync from scratch',
    )
    await getEntityManager()
      .getRepository(BitEntity)
      .delete({ appId: app.id }) // todo: drop people as well
    data.values.lastSync = lastSync = {}
  }

  // we if we have last history id it means we already did a complete sync and now we are using
  // gmail's history api to get email events information and sync based on this information
  if (lastSync.historyId) {
    // load history
    const history = await loader.loadHistory(lastSync.historyId)

    // load threads for newly added / changed threads
    if (history.addedThreadIds.length) {
      log.timer('found added/changed messages in history', history.addedThreadIds)

      // convert added thread ids into thread objects and load their messages
      const addedThreads = await Promise.all(
        history.addedThreadIds.map(async threadId => {
          return {
            id: threadId,
            historyId: history.historyId,
          } as GMailThread
        }),
      )
      await loader.loadMessages(addedThreads)

      // sync threads
      for (let thread of addedThreads) {
        await isAborted(app)
        await sleep(10)
        await syncThread(thread)
      }

      log.timer('found added or changed messages in history')
    } else {
      log.info('no added or changed messages in history were found')
    }

    // load bits for removed threads and remove them
    if (history.removedThreadIds.length) {
      log.info('found actions in history for thread removals', history.removedThreadIds)
      const removedBits = await getEntityManager()
        .getRepository(BitEntity)
        .find({
          appId: app.id,
          id: In(history.removedThreadIds.map(threadId => BitUtils.id(app, threadId))),
        })
      log.info('found bits to be removed, removing', removedBits)
      await getEntityManager()
        .getRepository(BitEntity)
        .remove(removedBits) // todo: we also need to remove people
    } else {
      log.info('no removed messages in history were found')
    }

    lastSync.historyId = history.historyId
    await getEntityManager()
      .getRepository(AppEntity)
      .save(app, { listeners: false })
  } else {
    // else this is a first time sync, load all threads
    log.timer('sync all threads')

    await loader.loadThreads({
      count: data.values.max,
      queryFilter: queryFilter,
      pageToken: lastSync.lastCursor,
      loadedCount: lastSync.lastCursorLoadedCount || 0,
      handler: handleThread.bind(this),
    })
    log.timer('sync all threads')
  }

  // load emails for whitelisted people separately
  // we don't make this operation on a first sync because we can miss newly added emails
  // this operation is relatively cheap, so for now we are okay with it
  if (data.values.whitelist) {
    log.info('checking whitelist', data.values.whitelist)
    const whitelistEmails = Object.keys(data.values.whitelist).filter(
      email => data.values.whitelist[email] === true,
    )

    if (whitelistEmails.length > 0) {
      log.timer('load threads from whitelisted people', whitelistEmails)
      // we split emails into chunks because gmail api can't handle huge queries
      const emailChunks = chunk(whitelistEmails, 100)
      for (let emails of emailChunks) {
        const whitelistFilter = emails.map(email => 'from:' + email).join(' OR ')
        await loader.loadThreads({
          count: data.values.max,
          queryFilter: whitelistFilter,
          loadedCount: 0,
          handler: syncThread.bind(this),
        })
      }
      log.timer('load threads from whitelisted people')
    } else {
      log.info('no enabled people in whitelist were found')
    }
  }
})
