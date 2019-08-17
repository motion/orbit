import { Cosal } from '@o/cosal'
import { Logger } from '@o/logger'
import { sleep } from '@o/utils'

import { ensureSetting, getSettingValue, updateSetting } from '../helpers/settingModelHelpers'

const log = new Logger('TopicsManager')

export class TopicsManager {
  cosal: Cosal
  scanTopicsInt: any
  updatedTo = 0

  constructor({ cosal }: { cosal: Cosal }) {
    this.cosal = cosal
  }

  async start() {
    log.info(`start()`)
    await ensureSetting('topicsIndexUpdatedTo', 0)
    this.scanTopicsInt = setInterval(this.scanTopics, 1000 * 60 * 15)
    await sleep(100)
    this.scanTopics()
  }

  dispose() {
    clearInterval(this.scanTopicsInt)
  }

  // clear all data and restart cosal
  async reset() {
    this.dispose()
    await updateSetting({
      topicsIndexUpdatedTo: 0,
    })
    await this.start()
  }

  scanTopics = async () => {
    if ((await getSettingValue('topicsIndexUpdatedTo')) === this.updatedTo) {
      return
    }
    console.log('Scanning topics')
    console.time('doScanTopics')
    this.updatedTo = Date.now()
    await updateSetting({
      topicsIndexUpdatedTo: this.updatedTo,
    })
    console.timeEnd('doScanTopics')
  }
}
