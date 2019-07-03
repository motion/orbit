import { Cosal } from '@o/cosal'
import { Logger } from '@o/logger'
import { Bit, BitEntity, getSearchableText } from '@o/models'
import { sleep } from '@o/utils'
import { remove } from 'fs-extra'
import { chunk, last } from 'lodash'
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
    setTimeout(() => {
      console.log('Starting cosal...')
      this.cosal.start()
      console.log('Finished starting cosal...')
    }, 8000)

    // sleep a bit, this is a heavy-ish operation and we can do it after things startup
    // TODO make this a bit better so its controlled above
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
    // heavy so wait a little
    await sleep(10000)

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
      const cosalIndexUpdatedTo = last(chunk).bitUpdatedAt
      log.info(`Update cosal to ${cosalIndexUpdatedTo}`)
      await updateSetting({
        cosalIndexUpdatedTo,
      })

      // avoid burning too much cpu
      await sleep(250)
    }

    log.info('Done scanning new bits')
  }
}
