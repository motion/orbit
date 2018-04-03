import { Bit, Setting, createOrUpdate } from '@mcro/models'
import debug from '@mcro/debug'
import { sleep } from '@mcro/helpers'
import getHelpers from './getHelpers'
import { first, last } from 'lodash'

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
  messages: [Message]
}

export default class GoogleMailSync {
  helpers = getHelpers({})
  setting: Setting

  fetch = (path, ...rest) => this.helpers.fetch(`/gmail/v1${path}`, ...rest)

  constructor(setting) {
    this.setting = setting
    this.helpers = getHelpers(setting)
  }

  run = async () => {
    try {
      // await this.syncMail()
    } catch (err) {
      console.error(`GMail sync error ${err.message}`)
    }
  }

  async syncMail() {
    const threads = await this.getThreads()
    log('syncMail', threads)
    const results = await this.mapThreads(threads.threads, this.createThread)
    return results
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

  async getThreads(pages = 1, query: { pageToken?: any } = {}) {
    let threads = []
    let pageToken
    let fetchedPages = 0
    while (fetchedPages < pages) {
      fetchedPages++
      if (fetchedPages > 1) {
        await sleep(80)
      }
      const res = await this.fetchThreads(query)
      console.log('got threads', res)
      if (res) {
        threads = [...threads, ...res.threads]
        if (res.nextPageToken) {
          query.pageToken = res.nextPageToken
          pageToken = res.nextPageToken
        }
      } else {
        console.error('No res', res, query)
      }
    }
    return { threads, pageToken }
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
