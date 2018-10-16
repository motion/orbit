import { getGlobalConfig } from '@mcro/config'
import { Logger } from '@mcro/logger'
import { GmailSetting } from '@mcro/models'
import { ServiceLoader } from '../loader/ServiceLoader'
import { ServiceLoaderSettingSaveCallback } from '../loader/ServiceLoaderTypes'
import { GMailQueries } from './GMailQueries'
import { GMailHistoryLoadResult, GMailThread, GMailUserProfile } from './GMailTypes'

/**
 * Loads data from GMail service.
 */
export class GMailLoader {
  private setting: GmailSetting
  private log: Logger
  private loader: ServiceLoader

  constructor(setting: GmailSetting, log?: Logger, saveCallback?: ServiceLoaderSettingSaveCallback) {
    this.setting = setting
    this.log = log || new Logger('service:gmail:loader:' + this.setting.id)
    this.loader = new ServiceLoader(
      this.setting,
      this.log,
      this.baseUrl(),
      this.requestHeaders(),
      saveCallback
    )
  }

  /**
   * Loads user's GMail profile.
   */
  async loadProfile(): Promise<GMailUserProfile> {
    this.log.timer('loading user profile')
    const result = await this.loader.load(GMailQueries.userProfile())
    this.log.timer('loading user profile', result)
    return result
  }

  /**
   * Loads user history.
   * History represents latest changes in user inbox.
   * For example when user receives new messages or removes exist messages.
   */
  async loadHistory(startHistoryId: string, pageToken?: string): Promise<GMailHistoryLoadResult> {

    // load a history first
    this.log.verbose('loading history', { startHistoryId, pageToken })
    const result = await this.loader.load(GMailQueries.history(startHistoryId, pageToken))
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
          const trashedOrSpam = history.labelsAdded.filter(action => {
            return action.labelIds.indexOf('TRASH') !== -1 && action.labelIds.indexOf('SPAM') !== -1
          })
          trashedOrSpam.forEach(action => {
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
    queryFilter?: string,
    filteredIds: string[] = [],
    pageToken?: string,
  ): Promise<GMailThread[]> {

    // load all threads first
    this.log.verbose(`loading threads`, { count, queryFilter, filteredIds, pageToken })
    const query = GMailQueries.threads(count > 100 ? 100 : count, queryFilter, pageToken)
    const result = await this.loader.load(query)
    this.log.verbose(`threads loaded`, result)

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
    // if (maxMonths > 0) {
    //   const lastThread = threads[threads.length - 1]
    //   const lastMessage = lastThread.messages[lastThread.messages.length - 1]
    //   if (lastMessage.internalDate) {
    //     const lastMessageTime = parseInt(lastMessage.internalDate)
    //     const currentDate = new Date()
    //     const monthsAgo = currentDate.setMonth(currentDate.getMonth() - 1)
    //     if (lastMessageTime <= monthsAgo) {
    //       this.log.verbose(`reached month limit`, { threads, lastThread, lastMessage, lastMessageTime, monthsAgo })
    //       return threads
    //     }
    //   }
    // }

    // load threads from the next page if available
    if (result.nextPageToken) {
      const nextPageThreads = await this.loadThreads(
        count,
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
  private async loadMessages(threads: GMailThread[]): Promise<void> {
    this.log.verbose('loading thread messages', threads)
    await Promise.all(
      threads.map(async thread => {
        const result = await this.loader.load(GMailQueries.thread(thread.id))
        Object.assign(thread, result)
      }),
    )
    this.log.verbose('thread messages are loaded', threads)
  }

  /**
   * Builds base url for the service loader queries.
   */
  private baseUrl(): string {
    return 'https://www.googleapis.com/gmail/v1'
  }

  /**
   * Builds request headers for the service loader queries.
   */
  private requestHeaders() {
    return {
      Authorization: `Bearer ${this.setting.token}`,
      'Access-Control-Allow-Origin': getGlobalConfig().urls.serverHost,
      'Access-Control-Allow-Methods': 'GET',
    }
  }

}
