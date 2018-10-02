import { Logger } from '@mcro/logger'
import { Setting } from '@mcro/models'
import { GMailFetcher } from './GMailFetcher'
import { GMailQueries } from './GMailQueries'
import { GmailHistoryLoadResult, GmailThread } from './GMailTypes'

/**
 * Loads data from GMail service.
 */
export class GMailLoader {
  setting: Setting
  fetcher: GMailFetcher
  log: Logger

  constructor(setting: Setting) {
    this.setting = setting
    this.log = new Logger('service:gmail:loader:' + this.setting.id)
    this.fetcher = new GMailFetcher(setting)
  }

  /**
   * Loads user history.
   * History represents latest changes in user inbox.
   * For example when user receives new messages or removes exist messages.
   */
  async loadHistory(startHistoryId: string, pageToken?: string): Promise<GmailHistoryLoadResult> {

    // load a history first
    this.log.verbose(pageToken ? 'loading history from the next page' : 'loading history')
    const query = GMailQueries.history(startHistoryId, pageToken)
    const result = await this.fetcher.fetch(query)
    this.log.verbose('history loaded', result)

    // collect from history list of added/changed and removed thread ids
    let addedThreadIds: string[] = [],
      deletedThreadIds: string[] = []

    // find changes in history if it exist
    if (result.history) {
      result.history.forEach(history => {
        if (history.messagesAdded) {
          history.messagesAdded.forEach(action => {
            const threadId = action.message.threadId
            if (addedThreadIds.indexOf(threadId) === -1) addedThreadIds.push(threadId)
          })
        }
        if (history.messageDeleted) {
          history.messageDeleted.forEach(action => {
            const threadId = action.message.threadId
            if (deletedThreadIds.indexOf(threadId) === -1) deletedThreadIds.push(threadId)
          })
        }
        if (history.labelsAdded) {
          const trashed = history.labelsAdded.filter(
            action => action.labelIds.indexOf('TRASH') !== -1,
          )
          trashed.forEach(action => {
            const threadId = action.message.threadId
            if (deletedThreadIds.indexOf(threadId) === -1) deletedThreadIds.push(threadId)
          })
        }
      })
    }

    // load history from the next page is available
    if (result.nextPageToken) {
      const newPageResult = await this.loadHistory(startHistoryId, result.nextPageToken)

      return {
        historyId: result.historyId,
        addedThreadIds: [...addedThreadIds, ...newPageResult.addedThreadIds],
        removedThreadIds: [...deletedThreadIds, ...newPageResult.removedThreadIds],
      }
    }

    return {
      historyId: result.historyId,
      addedThreadIds: addedThreadIds,
      removedThreadIds: deletedThreadIds,
    }
  }

  /**
   * Loads threads from the gmail.
   * Count is the maximal number of threads to load.
   */
  async loadThreads(
    count: number,
    maxMonths?: number,
    queryFilter?: string,
    filteredIds: string[] = [],
    pageToken?: string,
  ): Promise<GmailThread[]> {

    // load all threads first
    this.log.verbose(`loading threads`, { count, maxMonths, queryFilter, filteredIds, pageToken })
    const query = GMailQueries.threads(count > 100 ? 100 : count, queryFilter, pageToken)
    const result = await this.fetcher.fetch(query)
    if (!result) return []
    let threads = result.threads
    if (!threads) return []

    // load messages for those threads
    await this.loadMessages(threads)

    // if array of filtered thread ids were passed then we load threads until we find all threads by given ids
    // once we found all threads we stop loading threads
    if (filteredIds.length) {
      // filter out threads and left only those matching given ids
      // if we find filtered thread we remove its id from the filter list
      threads = []
      result.threads.forEach(thread => {
        const indexInFiltered = filteredIds.indexOf(thread.id)
        if (indexInFiltered !== -1) {
          threads.push(thread)
          filteredIds.splice(indexInFiltered, 1)
        }
      })

      // this condition means we just found all requested threads, no need to load next page
      if (filteredIds.length === 0) {
        this.log.verbose('all requested threads were found')
        return threads
      }
    }

    // decrease number of threads we need to load
    // once we count is less than one we stop loading threads
    count -= result.threads.length // important to use result.threads here instead of mutated threads
    if (count < 1) {
      this.log.verbose('stopped loading, maximum number of threads were loaded', threads.length)
      return threads
    }

    // check if we reached email period limitation (e.g. 1 month)
    if (maxMonths > 0) {
      const lastThread = threads[threads.length - 1]
      const lastMessage = lastThread.messages[lastThread.messages.length - 1]
      if (lastMessage.internalDate) {
        const lastMessageTime = parseInt(lastMessage.internalDate)
        const currentDate = new Date()
        const monthsAgo = currentDate.setMonth(currentDate.getMonth() - 1)
        if (lastMessageTime <= monthsAgo) {
          this.log.info(`reached month limit`, { threads, lastThread, lastMessage, lastMessageTime, monthsAgo })
          return threads
        }
      }
    }

    // load threads from the next page if available
    if (result.nextPageToken) {
      const nextPageThreads = await this.loadThreads(
        count,
        maxMonths,
        queryFilter,
        filteredIds,
        result.nextPageToken,
      )
      return [...threads, ...nextPageThreads]
    }

    return threads
  }

  /**
   * Loads thread messages and pushes them into threads.
   */
  private async loadMessages(threads: GmailThread[]): Promise<void> {
    this.log.verbose('loading thread messages', threads)
    await Promise.all(
      threads.map(async thread => {
        const query = GMailQueries.thread(thread.id)
        const result = await this.fetcher.fetch(query)
        Object.assign(thread, result)
      }),
    )
    this.log.verbose('thread messages are loaded', threads)
  }

}
