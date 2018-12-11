import { BitEntity, SettingEntity, Setting } from '@mcro/models'
import { getRepository } from 'typeorm'
import { Logger } from '@mcro/logger'
import { Cosal } from '@mcro/cosal'
import { chunk, zip, flatten, last } from 'lodash'
import { remove } from 'fs-extra'
import { COSAL_DB } from '../constants'
import { sleep } from '@mcro/utils'

const log = new Logger('CosalManager')

const getGeneralSetting = () => getRepository(SettingEntity).findOne({ name: 'general' })

export class CosalManager {
  cosal: Cosal
  scanTopicsInt: any
  dbPath: string

  constructor({ dbPath }: { dbPath: string }) {
    this.dbPath = dbPath
  }

  async start() {
    this.cosal = new Cosal({
      database: this.dbPath,
    })
    await this.cosal.start()
    // sleep a bit, this is a heavy-ish operation and we can do it after things startup
    // TODO make this a bit better so its controlled above
    await sleep(2000)
    this.updateSearchIndexWithNewBits()
    this.scanTopics()
  }

  dispose() {
    clearInterval(this.scanTopicsInt)
  }

  // clear all data and restart cosal
  async reset() {
    this.dispose()
    await remove(COSAL_DB)
    await this.updateSetting({
      cosalIndexUpdatedTo: 0,
    })
    await this.start()
  }

  search = async (query: string, { max = 10 }) => {
    const res = await this.cosal.search(query, max)
    const ids = res.map(x => x.id)
    return await getRepository(BitEntity).find({ id: { $in: ids } })
  }

  private async ensureDefaultSetting() {
    const setting = await getGeneralSetting()
    if (typeof setting.values.cosalIndexUpdatedTo === 'number') {
      return
    }
    await this.updateSetting({
      cosalIndexUpdatedTo: 0,
    })
  }

  private async getLastScan() {
    this.ensureDefaultSetting()
    return (await getGeneralSetting()).values.cosalIndexUpdatedTo
  }

  updateSearchIndexWithNewBits = async () => {
    const lastScanAt = await this.getLastScan()
    const bitsSinceLastScan = await getRepository(BitEntity).find({
      where: {
        bitUpdatedAt: { $moreThan: lastScanAt },
      },
      order: {
        bitUpdatedAt: 'ASC',
      },
    })
    log.info('bitsSinceLastScan', bitsSinceLastScan.length)

    if (!bitsSinceLastScan.length) {
      return
    }

    // scan just a few at a time
    const chunks = chunk(bitsSinceLastScan, 50)
    for (const chunk of chunks) {
      log.verbose(`Scanning ${chunk.length} bits...`)
      await this.cosal.scan(
        chunk.map(bit => ({
          id: bit.id,
          text: bit.body,
        })),
      )

      // update scanned up to so it can resume if interrupted
      await this.updateSetting({
        cosalIndexUpdatedTo: last(chunk).bitUpdatedAt,
      })

      // avoid burning too much cpu
      await sleep(250)
    }

    log.info('Done scanning new bits')
  }

  private async updateSetting(values: Setting['values']) {
    const setting = await getGeneralSetting()
    setting.values = {
      ...setting.values,
      ...values,
    }
    await getRepository(SettingEntity).save(setting)
  }

  scanTopics = () => {
    this.scanTopicsInt = setInterval(this.doScanTopics, 1000 * 60 * 15)
    this.doScanTopics()
  }

  doScanTopics = async () => {
    console.log('Scanning topics')
    console.time('doScanTopics')
    const topTopics = await this.getGlobalTopTopics()
    const setting = await getGeneralSetting()
    setting.values.topTopics = topTopics
    await getRepository(SettingEntity).save(setting)
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
      const bodies = bits.map(bit => `${bit.title} ${bit.body}`).join(' ')
      const topics = await this.cosal.getTopWords(bodies, { max: 10, sortByWeight: true })
      // dont flatten
      allTopics = [...allTopics, topics]
    }
    const topTopics = flatten(flatten(zip(allTopics)))
    return topTopics
  }
}
