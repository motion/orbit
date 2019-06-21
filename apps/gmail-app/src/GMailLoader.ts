import { AppBit, getGlobalConfig, Logger, ServiceLoader, ServiceLoaderAppSaveCallback, sleep } from '@o/kit'

import { GMailHistoryLoadResult, GMailThread, GMailUserProfile } from './GMailModels'
import { GMailQueries } from './GMailQueries'

/**
 * Defines a loading throttling.
 * This is required to not overload user network with service queries.
 */
const THROTTLING = {
  /**
   * Delay before history list load.
   */
  history: 100,

  /**
   * Delay before threads load.
   */
  threads: 100,

  /**
   * Delay before messages load.
   */
  messages: 100,
}

/**
 * Loads data from GMail service.
 */
export class GMailLoader {
  private app: AppBit
  private log: Logger
  private loader: ServiceLoader

  constructor(app: AppBit, log?: Logger, saveCallback?: ServiceLoaderAppSaveCallback) {
    this.app = app
    this.log = log || new Logger('service:gmail:loader:' + this.app.id)
    this.loader = new ServiceLoader(this.app, this.log, {
      saveCallback,
      baseUrl: 'https://www.googleapis.com/gmail/v1',
      headers: {
        Authorization: `Bearer ${this.app.token}`,
        'Access-Control-Allow-Origin': getGlobalConfig().urls.serverHost,
        'Access-Control-Allow-Methods': 'GET',
      },
    })
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
    await sleep(THROTTLING.history)

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
  async loadThreads(options: {
    count: number
    queryFilter?: string
    filteredIds?: string[]
    pageToken?: string
    loadedCount?: number
    handler: (
      thread: GMailThread,
      cursor?: string,
      loadedCount?: number,
      isLast?: boolean,
    ) => Promise<boolean> | boolean
  }): Promise<void> {
    const loadRecursively = async (
      count: number,
      filteredIds?: string[],
      pageToken?: string,
      loadedCount?: number,
    ) => {
      await sleep(THROTTLING.threads)
      let { queryFilter, handler } = options

      // load all threads first
      this.log.info('loading threads', { count, queryFilter, filteredIds, pageToken })
      const query = GMailQueries.threads(count > 100 ? 100 : count, queryFilter, pageToken)
      const result = await this.loader.load(query)

      // if query doesn't return any email result.threads will be undefined
      if (!result.resultSizeEstimate) return

      this.log.info(
        `${result.threads.length} threads were loaded (${loadedCount +
          result.threads.length} of ${loadedCount + result.resultSizeEstimate} estimated)`,
        result,
      )

      if (!result) return
      let threads = result.threads
      if (!threads) return

      // if array of filtered thread ids were passed then we load threads until we find all threads by given ids
      // once we found all threads we stop loading threads
      if (filteredIds) {
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
      }

      // load messages for those threads
      await this.loadMessages(threads)

      // call handler function for each loaded thread
      for (let i = 0; i < threads.length; i++) {
        const thread = threads[i]
        try {
          const isLast = i === threads.length - 1 && !result.nextPageToken
          const handleResult = await handler(
            threads[i],
            result.nextPageToken,
            loadedCount + threads.length,
            isLast,
          )

          // if callback returned true we don't continue syncing
          if (handleResult === false) {
            this.log.info('stopped threads syncing, no need to sync more', { thread, index: i })
            return // return from the function, not from the loop!
          }
        } catch (error) {
          this.log.warning('error during thread handling', thread, error)
        }
      }

      // decrease number of threads we need to load
      // once we count is less than one we stop loading threads
      count -= result.threads.length // important to use result.threads here instead of mutated threads
      if (count < 1) {
        this.log.verbose('stopped loading, maximum number of threads were loaded', threads.length)
        return
      }

      // load threads from the next page if available
      if (result.nextPageToken) {
        // this condition means we just found all requested threads, no need to load next page
        if (filteredIds && filteredIds.length === 0) {
          this.log.verbose('all requested threads were found')
          return
        }

        await loadRecursively(
          count,
          filteredIds,
          result.nextPageToken,
          loadedCount + threads.length,
        )
      }
    }

    this.log.timer('sync all threads')
    await loadRecursively(
      options.count,
      options.filteredIds,
      options.pageToken,
      options.loadedCount,
    )
    this.log.timer('sync all threads')
  }

  /**
   * Loads thread messages and pushes them into threads.
   */
  async loadMessages(threads: GMailThread[]): Promise<void> {
    await sleep(THROTTLING.messages)

    this.log.verbose('loading thread messages', threads)
    for (let thread of threads) {
      const result = await this.loader.load(GMailQueries.thread(thread.id))
      Object.assign(thread, result)
    }
    this.log.verbose('thread messages are loaded', threads)
  }
}
