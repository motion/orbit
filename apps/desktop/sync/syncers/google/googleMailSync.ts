import { Bit, Setting, createOrUpdate } from '@mcro/models'
import debug from '@mcro/debug'
import { sleep } from '@mcro/helpers'
import getHelpers from './getHelpers'
import { first, last, pickBy } from 'lodash'

const log = debug('googleMail')
const timeCancel = (asyncFn, ms) => {
  return new Promise((res, rej) => {
    const cancel = setTimeout(() => rej('timeCancel: Took too long'), ms)
    asyncFn.then(val => {
      clearTimeout(cancel)
      res(val)
    })
  })
}

type Message = {
  id: string
  threadId: string
  labelIds: [string]
  snippet: string
  historyId: string
  internalDate: string
  payload: {
    headers: [{ name: string; value: string }]
  }
}

type ThreadObject = {
  id: string
  historyId: string
  messages: [Message]
}

export default class GoogleMailSync {
  helpers = getHelpers({})
  setting: Setting

  fetch = (path, ...rest) => this.helpers.fetch(`/gmail/v1${path}`, ...rest)

  constructor(setting) {
    this.updateSetting(setting)
  }

  updateSetting = async (setting?) => {
    this.setting = setting || (await Setting.findOne({ type: 'google' }))
    this.helpers = getHelpers(this.setting)
  }

  run = async () => {
    try {
      await this.syncMail()
    } catch (err) {
      console.error(err)
    }
  }

  async syncMail(options = { limit: 10, partial: true }) {
    await this.updateSetting()
    const { limit, partial } = options
    let historyId
    if (partial) {
      historyId = this.setting.values.historyId
      log(`Using partial historyId`, historyId)
    }
    try {
      const newHistoryId = await this.streamThreads('', { max: 10 })
      if (newHistoryId) {
        this.setting.values.historyId = newHistoryId
        await this.setting.save()
      }
    } catch (err) {
      if (err.message === 'Invalid Credentials') {
        // refresh and try again
        console.log('refreshing token...')
        if (await this.helpers.refreshToken()) {
          return await this.syncMail(options)
        }
        return
      }
      console.log('some other err', err)
    }
  }

  streamThreads(query, options): Promise<string | null> {
    return new Promise((res, rej) => {
      this.helpers.batch.estimatedThreads(query, options, (err, estimate) => {
        const max = Math.min(options.max || 0, estimate)
        if (err) {
          return rej(err)
        }
        console.log('getting threads', max)
        const threadSyncer = this.helpers.batch.threads(query, options)
        let newHistoryId
        let fetched = 0
        threadSyncer.on('data', (thread: ThreadObject) => {
          fetched++
          if (!newHistoryId) {
            newHistoryId = thread.historyId
          }
          console.log('creating', fetched, 'thread')
          this.createThread(thread)
          if (fetched === max) {
            res(newHistoryId || null)
          }
        })
      })
    })
  }

  getDateFromThread = (message: Message) =>
    message.payload.headers.find(x => x.name === 'Date').value

  createThread = async (data: ThreadObject) => {
    const { id, messages } = data
    const firstMessage = first(messages)
    const bitCreatedAt = this.getDateFromThread(firstMessage)
    const bitUpdatedAt = this.getDateFromThread(last(messages))
    return await createOrUpdate(
      Bit,
      {
        identifier: id,
        integration: 'google',
        type: 'mail',
        title: firstMessage.payload.headers.find(x => x.name === 'Subject')
          .value,
        body: firstMessage.snippet,
        data,
        bitCreatedAt,
        bitUpdatedAt,
      },
      ['identifier', 'integration', 'type'],
    )
  }

  async getThreads(
    pages = 1,
    query: { pageToken?: string; historyId?: string } = {},
  ) {
    const { pageToken, historyId } = query
    let threads = []
    let lastPageToken = pageToken
    let fetchedPages = 0
    while (fetchedPages < pages) {
      fetchedPages++
      if (fetchedPages > 1) {
        await sleep(80)
      }
      const res = await this.fetchThreads(
        pickBy({ pageToken: lastPageToken, historyId }, x => query[x]),
      )
      if (res) {
        threads = [...threads, ...res.threads]
        lastPageToken = res.nextPageToken
      } else {
        console.error('No res', res, { pageToken, historyId })
      }
    }
    return { threads, lastPageToken }
  }

  async mapThreads(threads, onThread) {
    let results = []
    for (const { id } of threads) {
      log(`mapThread`, id)
      let info
      try {
        info = await this.fetchThread(id)
        await sleep(500)
      } catch (err) {
        console.log('error fetching thread', id, err)
        continue
      }
      results.push(await onThread(info))
      log('finish', id)
    }
    return results
  }

  fetchThreads = query => this.fetch('/users/me/threads', { query })
  fetchThread = (id, query?) =>
    timeCancel(this.fetch(`/users/me/threads/${id}`, { query }), 3000)

  async getMessages() {
    console.log(await this.fetch(`/users/me/messages`))
    return []
  }
}
