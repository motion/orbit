import { BitEntity, SettingEntity, Bit, BitUtils } from '@mcro/models'
import { getRepository } from 'typeorm'
import { Logger } from '@mcro/logger'
import { Cosal } from '@mcro/cosal'
import { chunk, zip, flatten, last } from 'lodash'
import { remove } from 'fs-extra'
import { COSAL_DB } from '../constants'
import { sleep } from '@mcro/utils'
import { getSetting, getSettingValue, updateSetting } from '../helpers/settingModelHelpers'

const log = new Logger('CosalManager')

const getBitForScan = (bit: Bit) => {
  return {
    id: bit.id,
    text: BitUtils.getSearchableText(bit),
  }
}

export class CosalManager {
  cosal: Cosal
  scanTopicsInt: any
  dbPath: string

  constructor({ dbPath }: { dbPath: string }) {
    this.dbPath = dbPath
  }

  async start() {
    await this.ensureDefaultSetting()
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
    await updateSetting({
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
    if (typeof (await this.getLastScan()) === 'number') {
      return
    }
    await updateSetting({
      cosalIndexUpdatedTo: 0,
    })
  }

  private async getLastScan() {
    return getSettingValue('cosalIndexUpdatedTo')
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
    for (const [index, chunk] of chunks.entries()) {
      log.verbose(`Scanning ${chunk.length * (index + 1)}/${bitsSinceLastScan.length}...`)
      await this.cosal.scan(
        chunk
          .map(getBitForScan)
          // ensure has some text
          .filter(bit => !!bit.text),
      )

      // update scanned up to so it can resume if interrupted
      await updateSetting({
        cosalIndexUpdatedTo: last(chunk).bitUpdatedAt,
      })

      // avoid burning too much cpu
      await sleep(250)
    }

    log.info('Done scanning new bits')
  }

  scanTopics = () => {
    this.scanTopicsInt = setInterval(this.doScanTopics, 1000 * 60 * 15)
    this.doScanTopics()
  }

  doScanTopics = async () => {
    console.log('Scanning topics')
    console.time('doScanTopics')
    const topTopics = await this.getGlobalTopTopics()
    const setting = await getSetting()
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
      const bodies = bits.map(BitUtils.getSearchableText).join(' ')
      const topics = await this.cosal.getTopWords(bodies, { max: 10, sortByWeight: true })
      // dont flatten
      allTopics = [...allTopics, topics]
    }
    const topTopics = flatten(flatten(zip(allTopics)))
    return topTopics
  }
}
