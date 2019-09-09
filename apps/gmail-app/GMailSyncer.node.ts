import { sleep, SyncerRunner } from '@o/worker-kit'
import { chunk } from 'lodash'

import { GMailBitFactory } from './GMailBitFactory'
import { GMailLoader } from './GMailLoader'
import { GMailMessageParser } from './GMailMessageParser'
import { GmailAppData, GmailBitDataParticipant, GMailThread } from './GMailModels'

/**
 * Syncs GMail.
 */
export const GMailSyncer: SyncerRunner = async ({ app, log, utils }) => {
  const data: GmailAppData = app.data
  const loader = new GMailLoader(app, log, () => utils.updateAppData())
  const factory = new GMailBitFactory(utils)

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
      await utils.updateAppData()
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
      await utils.updateAppData()
      return true
    }

    // update last sync settings to make sure we continue from the last point in the case if application will stop
    if (lastSync.lastCursor !== cursor) {
      log.verbose('updating last cursor in settings', { cursor })
      lastSync.lastCursor = cursor
      lastSync.lastCursorLoadedCount = loadedCount
      await utils.updateAppData()
    }

    return true
  }

  /**
   * Syncs a given thread.
   */
  const syncThread = async (thread: GMailThread) => {
    const participants = extractThreadParticipants(thread)
    const bit = factory.createMailBit(thread)

    // if email doesn't have body messages we don't need to sync it
    if (!bit) return

    bit.people = participants.map(participant => factory.createPersonBit(participant))

    await utils.saveBits(bit.people)
    await utils.saveBit(bit)
    return true
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

  // mail whitelister

  // load person because we need emails that we want to whitelist
  const people = await utils.loadBits({
    type: 'person',
    appIdentifiers: ['slack', 'github', 'drive', 'jira', 'confluence'],
  })
  const emails = people.map(person => person.email).filter(email => email.indexOf('@') !== -1)
  log.info('emails from the person bits', emails)

  // next we find all gmail Apps to add those emails to their whitelists
  const Apps = await utils.loadApps({ identifier: 'gmail' })

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
    await utils.updateAppData()
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
  await utils.updateAppData()

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
    await utils.clearBits()
    data.values.lastSync = lastSync = {}
  }

  // we if we have last history id it means we already did a complete sync and now we are using
  // gmail's history api to get email events information and sync based on this information
  if (lastSync.historyId) {
    // load history
    const history = await loader.loadHistory(lastSync.historyId)

    // load threads for newly added / changed threads
    if (history.addedThreadIds.length) {
      log.timer('found added/changed messages in history', history.addedThreadIds.length)

      // convert added thread ids into thread objects and load their messages
      const addedThreads = await Promise.all(
        history.addedThreadIds.map(
          async (threadId): Promise<GMailThread> => {
            return {
              id: threadId,
              historyId: history.historyId,
              messages: null,
            }
          },
        ),
      )
      await loader.loadMessages(addedThreads)

      // sync threads
      for (let thread of addedThreads) {
        await utils.isAborted()
        await sleep(30)
        await syncThread(thread)
      }

      log.timer('found added or changed messages in history')
    } else {
      log.info('no added or changed messages in history were found')
    }

    // load bits for removed threads and remove them
    if (history.removedThreadIds.length) {
      log.info('found actions in history for thread removals', history.removedThreadIds.length)
      const removedBits = await utils.loadBits({
        ids: history.removedThreadIds.map(threadId => utils.generateBitId(threadId)),
      })
      await utils.removeBits(removedBits)
    } else {
      log.info('no removed messages in history were found')
    }

    lastSync.historyId = history.historyId
    await utils.updateAppData()
  } else {
    // else this is a first time sync, load all threads

    await loader.loadThreads({
      count: data.values.max,
      queryFilter: queryFilter,
      pageToken: lastSync.lastCursor,
      loadedCount: lastSync.lastCursorLoadedCount || 0,
      handler: handleThread,
    })
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
      for (let emls of emailChunks) {
        const whitelistFilter = emls.map(email => 'from:' + email).join(' OR ')
        await loader.loadThreads({
          count: data.values.max,
          queryFilter: whitelistFilter,
          loadedCount: 0,
          handler: syncThread,
        })
      }
      log.timer('load threads from whitelisted people')
    } else {
      log.info('no enabled people in whitelist were found')
    }
  }
}
