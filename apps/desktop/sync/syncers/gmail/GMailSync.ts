import { Bit, createOrUpdateBit, Setting } from '@mcro/models'
import { GMailLoader } from './GMailLoader'
import { parseMailDate, parseMailTitle } from './GMailMessageParser'
import { GmailThread } from './GMailTypes'
import {In} from "typeorm"

export class GMailSync {

  setting: Setting
  loader: GMailLoader

  constructor(setting: Setting) {
    this.setting = setting
    this.loader = new GMailLoader(setting)
  }

  async run() {
    try {
      console.log('synchronizing GMail')
      await this.syncMail()
    } catch (err) {
      console.error(err)
    }
  }

  private async syncMail(options = { fullUpdate: false }) {
    const { lastSyncSettings = {} } = this.setting.values
    const max = +(this.syncSettings.max || 0)
    const hasNewMaxValue = max !== +(lastSyncSettings.max || 0)
    const partialUpdate = options.fullUpdate !== true && !hasNewMaxValue
    if (hasNewMaxValue) {
      console.log(`Has new max: ${max} was ${lastSyncSettings.max}`)
    }
    const { historyId } = this.setting.values || { historyId: null }
    console.log('history id ', historyId)
    let addedThreads: GmailThread[], removedBits: Bit[]
    if (partialUpdate && historyId) {
      console.log('got history id saved in the settings', historyId)
      const [addedThreadIds, removedThreadIds] = await this.loader.loadHistory(historyId)
      addedThreads = addedThreadIds.map(threadId => ({ id: threadId } as GmailThread))

      if (removedThreadIds.length) {
        console.log('found actions in history for thread removals', removedThreadIds)
        removedBits = await Bit.find({ integration: 'gmail', identifier: In(removedThreadIds) })
        console.log('found bits to be removed', removedBits)
      }

    } else {
      console.log(`doing a full sync with ${max} max`)
      addedThreads = await this.loader.loadThreads(max)
    }
    await this.loader.loadMessages(addedThreads)
    await this.createBits(addedThreads)

    if (removedBits.length) {
      Bit.remove(removedBits)
      console.log('bits were removed', removedBits)
    }

    const newHistoryId = addedThreads.length > 0 ? addedThreads[0].historyId : null
    // update setting after run
    if (newHistoryId) {
      this.setting.values.historyId = newHistoryId
      this.setting.values.lastSyncSettings = this.syncSettings
      await this.setting.save()
    }
  }

  private async createBits(threads: GmailThread[]) {
    await Promise.all(threads.map(thread => {
      return createOrUpdateBit(Bit, {
        identifier: thread.id,
        integration: 'gmail',
        type: 'mail',
        title: parseMailTitle(thread.messages[0]) || '',
        body: '',
        data: thread,
        bitCreatedAt: parseMailDate(thread.messages[0]),
        bitUpdatedAt: parseMailDate(thread.messages[thread.messages.length - 1]),
      })
    }))
  }

  private get syncSettings() {
    return {
      max: 50,
      ...((this.setting.values || {}).syncSettings || {}),
    }
  }

}
