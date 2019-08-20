import { Cosal, CosalSearchOptions } from '@o/cosal'
import { Logger } from '@o/logger'
import { Bit, BitEntity, getSearchableText } from '@o/models'
import { sleep } from '@o/utils'
import { remove } from 'fs-extra'
import { last } from 'lodash'
import { getRepository } from 'typeorm'

import { COSAL_DB } from '../constants'
import { ensureSetting, getSettingValue, updateSetting } from '../helpers/settingModelHelpers'

const log = new Logger('CosalManager')

const getBitForScan = (bit: Bit) => {
  return {
    id: bit.id,
    text: getSearchableText(bit),
  }
}

export class CosalManager {
  cosal: Cosal
  scanTopicsInt: any
  dbPath: string

  constructor({ dbPath }: { dbPath: string }) {
    this.dbPath = dbPath
    this.cosal = new Cosal({
      database: this.dbPath,
    })
  }

  async start() {
    log.info(`start()`)
    await ensureSetting('cosalIndexUpdatedTo', 0)

    // heavy startup
    setTimeout(this.actuallyStart)
  }

  actuallyStart = async () => {
    await sleep(8000)
    log.info('Starting cosal...')
    await this.cosal.start()
    log.info('Finished starting cosal...')
    await sleep(2000)
    // sleep a bit, this is a heavy-ish operation and we can do it after things startup
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

  search = async (query: string, options: CosalSearchOptions) => {
    const res = await this.cosal.search(query, options)
    const ids = res.map(x => x.id)
    return await getRepository(BitEntity).find({ id: { $in: ids } })
  }

  private async getLastScan() {
    return getSettingValue('cosalIndexUpdatedTo')
  }

  updateSearchIndexWithNewBits = async () => {
    log.info(`updateSearchIndexWithNewBits`)
    const lastScanAt = await this.getLastScan()

    // scan just a few at a time
    let index = 0
    // limit how many it can do...
    while (index < 10000) {
      const chunk = await getRepository(BitEntity).find({
        where: {
          bitUpdatedAt: { $moreThan: lastScanAt },
        },
        order: {
          bitUpdatedAt: 'ASC',
        },
        take: 30,
        skip: index * 30,
      })
      index++
      log.verbose(`Scanning ${chunk.length}...`)
      if (!chunk.length) {
        break
      }
      await this.cosal.scan(
        chunk
          .map(getBitForScan)
          // ensure has some text
          .filter(bit => !!bit.text),
      )
      // update scanned up to so it can resume if interrupted
      const cosalIndexUpdatedTo = last(chunk).bitUpdatedAt
      log.info(`Update cosal to ${cosalIndexUpdatedTo}`)
      await updateSetting({
        cosalIndexUpdatedTo,
      })
      // avoid using too much cpu
      await sleep(1000)
    }

    log.info('Done scanning new bits')
  }
}
