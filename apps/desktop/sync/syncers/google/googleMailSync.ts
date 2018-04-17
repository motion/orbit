import { Bit, Setting, insert, createOrUpdate } from '@mcro/models'
import debug from '@mcro/debug'
import { sleep } from '@mcro/helpers'
import getHelpers from './getHelpers'
import * as _ from 'lodash'
import { create } from 'domain'

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

  get syncSettings() {
    return {
      max: 50,
      ...((this.setting.values || {}).syncSettings || {}),
    }
  }

  async syncMail(options = { fullUpdate: false }) {
    await this.updateSetting()
    const { syncSettings } = this
    const { lastSyncSettings = {} } = this.setting.values
    const max = +(syncSettings.max || 0)
    const hasNewMaxValue = max !== +(lastSyncSettings.max || 0)
    const partialUpdate = options.fullUpdate !== true && !hasNewMaxValue
    if (hasNewMaxValue) {
      log(`Has new max: ${max} was  ${lastSyncSettings.max}`)
    }
    const { historyId } = this.setting.values || { historyId: null }
    if (partialUpdate && historyId) {
      const history = await this.fetch('/users/me/history', {
        query: { startHistoryId: historyId },
      })
      if (!history.history || !history.history.length) {
        return
      }
      if (history.history.length < max) {
        this.syncThreads({ max: history.history.length })
        return
      }
    }
    try {
      log(`Doing full sync with ${max} max`)
      const newHistoryId = await this.streamThreads('', { max })
      // update setting after run
      if (newHistoryId) {
        this.setting.values.historyId = newHistoryId
        this.setting.values.lastSyncSettings = syncSettings
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

  async syncThreads({ max }) {
    const { historyId } = this.setting.values
    log(`syncThreads`, historyId)
    const { threads } = await this.getThreads(Math.ceil(max / 100), {
      historyId,
    })
    const results = await this.mapThreads(
      threads.slice(0, max),
      this.createThread,
    )
    const unCreated = max - results.length
    if (unCreated) {
      log(`Couldn't sync ${unCreated} threads`)
    }
    if (results[0]) {
      this.setting.values.historyId = results[0].data.historyId
      await this.setting.save()
    }
  }

  streamThreads(query, options): Promise<string | null> {
    return new Promise((res, rej) => {
      this.helpers.batch.estimatedThreads(
        query,
        options,
        async (err, estimate) => {
          const max = Math.min(options.max || 0, estimate)
          if (err) {
            return rej(err)
          }
          const threadSyncer = this.helpers.batch.threads(query, options)
          let newHistoryId
          let fetched = 0
          let threads = []
          let syncing = true
          threadSyncer.on('data', async (thread: ThreadObject) => {
            fetched++
            if (!newHistoryId) {
              newHistoryId = thread.historyId
            }
            threads.push(this.createThreadObject(thread))
            if (fetched === max) {
              log('synced total threads', fetched, 'of', max)
              syncing = false
            }
          })
          await processQueue()
          res(newHistoryId || null)
          async function processQueue() {
            while (syncing || threads.length) {
              await sleep(500) // dont destroy resources
              if (!threads.length) {
                continue
              }
              const rows = _.take(threads, 50)
              threads = threads.slice(rows.length)
              const updateKeys = Object.keys(rows[0])
              for (const row of rows) {
                // insert, ignore, update
                let bit = await Bit.findOne(_.pick(row, Bit.identifyingKeys))
                if (bit) {
                  const cur = _.pick(bit, updateKeys)
                  if (_.isEqual(cur, row)) {
                    continue
                  }
                  log(`!equal, update`, cur, row)
                }
                if (!bit) {
                  bit = new Bit()
                }
                Object.assign(bit, row)
                await bit.save()
              }
            }
          }
        },
      )
    })
  }

  getDateFromThread = (message: Message) => {
    const dateHeader = message.payload.headers.find(x => x.name === 'Date')
    return (dateHeader && dateHeader.value) || 0
  }

  createThread = async (data: ThreadObject) => {
    return await createOrUpdate(
      Bit,
      this.createThreadObject(data),
      Bit.identifyingKeys,
    )
  }

  createThreadObject = (data: ThreadObject) => {
    const { id, messages } = data
    const firstMessage = _.first(messages)
    const bitCreatedAt = this.getDateFromThread(firstMessage)
    const bitUpdatedAt = this.getDateFromThread(_.last(messages))
    const subjectHeader = firstMessage.payload.headers.find(
      x => x.name === 'Subject',
    )
    return {
      identifier: id,
      integration: 'google',
      type: 'mail',
      title: (subjectHeader && subjectHeader.value) || '',
      body: firstMessage.snippet,
      data,
      bitCreatedAt,
      bitUpdatedAt,
    }
  }

  fetchThreads = query => this.fetch('/users/me/threads', { query })

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
      const query_ = _.pickBy(
        { pageToken: lastPageToken, historyId },
        x => query[x],
      )
      const res = await this.fetchThreads(query_)
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
      let info
      try {
        info = await this.fetchThread(id)
        await sleep(50)
      } catch (err) {
        console.log(err, id)
        continue
      }
      results.push(await onThread(info))
    }
    return results
  }

  fetchThread = (id, query?) =>
    timeCancel(this.fetch(`/users/me/threads/${id}`, { query }), 5000)

  async getMessages() {
    console.log(await this.fetch(`/users/me/messages`))
    return []
  }
}
