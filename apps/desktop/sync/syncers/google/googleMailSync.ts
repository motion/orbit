import { Bit, Setting, createOrUpdate } from '@mcro/models'
import { createInChunks } from '~/sync/helpers'
import debug from '@mcro/debug'
import { sleep } from '@mcro/helpers'
import getHelpers from './getHelpers'

const log = debug('googleMail')

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
      await this.syncMail()
    } catch (err) {
      console.error(`GMail sync error ${err.message}`)
    }
  }

  async syncMail() {
    const threads = await this.getThreads()
    // const results = await createInChunks(files, this.createMessage)
    log('syncMessages', threads)
    return threads
  }

  createMessage = async info => {
    console.log('got message', info)
    // const { name, contents, ...data } = info
    // const created = info.createdTime
    // const updated = info.modifiedTime
    // return await createOrUpdate(Bit, {
    //   id: info.id,
    //   integration: 'google',
    //   type: 'mail',
    //   title: name,
    //   body: contents,
    //   data,
    //   orgName: info.spaces ? info.spaces[0] : '',
    //   parentId: info.parents ? info.parents[0] : '',
    //   created,
    //   updated,
    // })
  }

  async getThreads(pages = 1, query: { pageToken?: any } = {}) {
    let all = []
    let fetchedPages = 0
    while (fetchedPages < pages) {
      fetchedPages++
      const res = await this.fetchThreads(query)
      if (res) {
        all = [...all, ...res.threads]
        if (res.nextPageToken) {
          query.pageToken = res.nextPageToken
        }
      } else {
        console.error('No res', res, query)
      }
    }
    return all
  }

  fetchThreads = query => this.fetch('/users/me/threads', { query })

  async getMessages() {
    console.log(await this.fetch(`/users/me/messages`))
    return []
  }
}
