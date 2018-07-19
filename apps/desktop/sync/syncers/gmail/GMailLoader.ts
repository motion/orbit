import { Setting } from '@mcro/models'
import { GmailHistoryMessageAction } from '~/sync/syncers/gmail/GMailTypes'
import { GMailFetcher } from './GMailFetcher'
import { historyQuery, threadQuery, threadsQuery } from './GMailQueries'
import { GmailThread } from './GMailTypes'

export class GMailLoader {

  setting: Setting
  fetcher: GMailFetcher

  constructor(setting: Setting) {
    this.setting = setting;
    this.fetcher = new GMailFetcher(setting)
  }

  async loadHistory(startHistoryId: string, pageToken?: string): Promise<[string[], string[]]> {
    console.log(`loading history`)
    const result = await this.fetcher.fetch(historyQuery(startHistoryId, pageToken))
    console.log(`history load result`, result)
    if (!result.history)
      return [[], []]

    const addedThreadIds = result.history
      .reduce((messages, history) => [...messages, ...(history.messagesAdded || [])], [] as GmailHistoryMessageAction[])
      .map(message => message.message.threadId)

    const deletedThreadIds = result.history
      .reduce((messages, history) => [...messages, ...(history.messageDeleted || [])], [] as GmailHistoryMessageAction[])
      .map(message => message.message.threadId)

    const trashedThreadIds = result.history
      .filter(history => history.labelsAdded && history.labelsAdded.some(action => action.labelIds.indexOf("TRASH") !== -1))
      .reduce((messages, history) => [...messages, ...(history.labelsAdded || [])], [] as GmailHistoryMessageAction[])
      .map(message => message.message.threadId)

    const allDeletedThreadIds = [...deletedThreadIds, ...trashedThreadIds];

    if (result.nextPageToken) {
      console.log(`next page!`)
      const [nextPageAddedThreadIds, nextPageDeletedThreadIds] = await this.loadHistory(startHistoryId, result.nextPageToken)
      return [
        [...addedThreadIds, ...nextPageAddedThreadIds],
        [...allDeletedThreadIds, ...nextPageDeletedThreadIds],
      ]
    }
    console.log(`history loaded`, addedThreadIds)
    return [
      addedThreadIds,
      allDeletedThreadIds,
    ]
  }

  async loadThreads(max: number, pageToken?: string): Promise<GmailThread[]> {
    console.log(`loading threads`)
    const result = await this.fetcher.fetch(threadsQuery(max, pageToken))
    max -= result.threads.length
    if (max > 0 && result.nextPageToken) {
      console.log(`next page`)
      const nextPageThreads = await this.loadThreads(max, result.nextPageToken)
      return [...result.threads, ...nextPageThreads]
    }
    console.log(`threads are loaded`, result.threads)
    return result.threads
  }

  async loadMessages(threads: GmailThread[]): Promise<void> {
    console.log(`loading thread messages`)
    await Promise.all(threads.map(async thread => {
      const result = await this.fetcher.fetch(threadQuery(thread.id, this.setting.values.filter))
      Object.assign(thread, result)
    }))
    console.log(`thread messages are loaded`, threads)
  }

}
