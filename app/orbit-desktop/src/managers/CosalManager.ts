import { Cosal } from '@mcro/cosal'
import { Logger } from '@mcro/logger'
import { Bit, BitEntity, BitUtils } from '@mcro/models'
import { sleep } from '@mcro/utils'
import { remove } from 'fs-extra'
import { chunk, last } from 'lodash'
import { getRepository } from 'typeorm'
import { COSAL_DB } from '../constants'
import { ensureSetting, getSettingValue, updateSetting } from '../helpers/settingModelHelpers'

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
    await ensureSetting('cosalIndexUpdatedTo', 0)
    this.cosal = new Cosal({
      database: this.dbPath,
    })
    await this.cosal.start()
    // sleep a bit, this is a heavy-ish operation and we can do it after things startup
    // TODO make this a bit better so its controlled above
    await sleep(2000)
    this.updateSearchIndexWithNewBits()
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
}
