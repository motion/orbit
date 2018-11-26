import { BitEntity, SettingEntity } from '@mcro/entities'
import { getRepository } from 'typeorm'
import { Logger } from '@mcro/logger'
import { Cosal } from '@mcro/cosal'
import { chunk, zip, flatten } from 'lodash'

const log = new Logger('CosalManager')

const getGeneralSetting = () => getRepository(SettingEntity).findOne({ name: 'general' })

export class CosalManager {
  cosal: Cosal
  scanTopicsInt: any

  constructor({ cosal }: { cosal: Cosal }) {
    this.cosal = cosal
  }

  dispose() {
    clearInterval(this.scanTopicsInt)
  }

  search = async (query: string, { max = 10 }) => {
    const res = await this.cosal.search(query, max)
    const ids = res.map(x => x.id)
    return await getRepository(BitEntity).find({ id: { $in: ids } })
  }

  private async getLastScan() {
    const setting = await getGeneralSetting()
    if (typeof setting.values.cosalIndexUpdatedTo === 'undefined') {
      setting.values.cosalIndexUpdatedTo = 0
      await getRepository(SettingEntity).save(setting)
    }
    return setting.values.cosalIndexUpdatedTo
  }

  updateSearchIndexWithNewBits = async () => {
    const lastScanAt = await this.getLastScan()
    const bitsSinceLastScan = await getRepository(BitEntity).find({
      where: { bitUpdatedAt: { $moreThan: lastScanAt } },
    })
    log.info('bitsSinceLastScan', bitsSinceLastScan.length)

    if (!bitsSinceLastScan.length) {
      return
    }

    // scan just a few at a time
    const chunks = chunk(bitsSinceLastScan, 100)
    for (const chunk of chunks) {
      log.verbose(`Scanning ${chunk.length} bits...`)
      await this.cosal.scan(
        chunk.map(bit => ({
          id: bit.id,
          text: bit.body,
        })),
      )
    }

    this.saveLastScanAt()
    log.info('Done scanning new bits')
  }

  saveLastScanAt = async () => {
    const setting = await getGeneralSetting()
    setting.values.cosalIndexUpdatedTo = Date.now()
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
