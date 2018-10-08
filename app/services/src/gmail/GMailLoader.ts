import { Logger } from '@mcro/logger'
import { Setting } from '@mcro/models'
import { GmailSettingValues } from '@mcro/models'
import { queryObjectToQueryString } from '../utils'
import { GMailQueries } from './GMailQueries'
import { GMailFetchOptions, GMailHistoryLoadResult, GMailThread } from './GMailTypes'
import { getGlobalConfig } from '@mcro/config'

/**
 * Loads data from GMail service.
 */
export class GMailLoader {
  setting: Setting
  log: Logger

  constructor(setting: Setting, log?: Logger) {
    this.setting = setting
    this.log = log || new Logger('service:gmail:loader:' + this.setting.id)
  }

  /**
   * Loads user history.
   * History represents latest changes in user inbox.
   * For example when user receives new messages or removes exist messages.
   */
  async loadHistory(startHistoryId: string, pageToken?: string): Promise<GMailHistoryLoadResult> {

    // load a history first
    this.log.verbose('loading history', { startHistoryId, pageToken })
    const query = GMailQueries.history(startHistoryId, pageToken)
    const result = await this.fetch(query)
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
    const result = await this.fetch(query)
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
        const query = GMailQueries.thread(thread.id)
        const result = await this.fetch(query)
        Object.assign(thread, result)
      }),
    )
    this.log.verbose('thread messages are loaded', threads)
  }

  /**
   * Fetches from a given GMail query.
   */
  private async fetch<T>(options: GMailFetchOptions<T>): Promise<T> {
    return this.doFetch('/gmail/v1' + options.url, options.query)
  }

  /**
   * Fetches from a given GMail query.
   */
  private async doFetch(path, query?: { [key: string]: any }, isRetrying = false) {
    const url = `https://www.googleapis.com${path}${queryObjectToQueryString(query)}`
    this.log.verbose('fetching', url)
    const response = await fetch(url, {
      mode: 'cors',
      headers: {
        Authorization: `Bearer ${this.setting.token}`,
        'Access-Control-Allow-Origin': getGlobalConfig().urls.serverHost,
        'Access-Control-Allow-Methods': 'GET',
      },
    })
    let result: any
    try {
      result = await response.json()
    } catch (err) {
      throw await (await fetch(url, {
        mode: 'cors',
        headers: {
          Authorization: `Bearer ${this.setting.token}`,
          'Access-Control-Allow-Origin': getGlobalConfig().urls.serverHost,
          'Access-Control-Allow-Methods': 'GET',
        },
      })).text()
    }

    if (result.error) {
      if (
        (result.error.message === 'Invalid Credentials' || result.error.code === 401) &&
        !isRetrying
      ) {
        this.log.verbose('refreshing token')
        const didRefresh = await this.refreshToken()
        if (didRefresh) {
          return await this.doFetch(path, query, true)
        } else {
          console.log('Cannot refresh access token', result)
          return null
        }
      }
      throw result.error
    }
    return result
  }

  /**
   * Refreshes OAuth token.
   */
  private async refreshToken() { // todo: create a separate loader component, replacements for r2
    const values = this.setting.values as GmailSettingValues
    if (!values.oauth.refreshToken) {
      return null
    }

    const formData = {
      refresh_token: values.oauth.refreshToken,
      client_id: values.oauth.clientId,
      client_secret: values.oauth.secret,
      grant_type: 'refresh_token',
    }
    const body = Object
      .keys(formData)
      .map(k => `${encodeURIComponent(k)}=${encodeURIComponent(formData[k])}`)
      .join('&')

    const response = await fetch('https://www.googleapis.com/oauth2/v4/token', {
      body,
      method: 'post',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })

    const reply = await response.json()
    if (reply.error) {
      throw reply.error

    } else {
      if (reply && reply.access_token) {
        this.setting.token = reply.access_token
        // await this.setting.save() // todo broken after extracting into services
        return true
      }
      return false
    }
  }

}
