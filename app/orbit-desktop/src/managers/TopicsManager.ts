import { Cosal } from '@o/cosal'
import { Logger } from '@o/logger'
import { BitEntity, getSearchableText } from '@o/models'
import { sleep } from '@o/utils'
import { flatten, zip } from 'lodash'
import { getRepository } from 'typeorm'

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
    const topTopics = await this.getGlobalTopTopics()
    this.updatedTo = Date.now()
    await updateSetting({
      topTopics,
      topicsIndexUpdatedTo: this.updatedTo,
    })
    console.timeEnd('doScanTopics')
  }

  getGlobalTopTopics = async () => {
    console.log('SCANNING ALL BITS MAY BE SUPER SLOW...')
    const totalBits = await getRepository(BitEntity).count()
    if (!totalBits) {
      return []
    }
    const maxPerGroup = 50
    const numScans = Math.ceil(totalBits / maxPerGroup)
    let allTopics: string[][] = []
    for (let i = 0; i < numScans; i++) {
      const bits = await getRepository(BitEntity).find({ take: maxPerGroup, skip: maxPerGroup * i })
      const bodies = bits.map(getSearchableText).join(' ')
      const topics = await this.cosal.getTopWords(bodies, { max: 10, sortByWeight: true })
      // dont flatten
      allTopics = [...allTopics, topics]
      await sleep(20)
    }
    const topTopics = flatten(flatten(zip(allTopics)))
    return topTopics
  }
}
