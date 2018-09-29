import { getGeneralSetting } from '../helpers/getSetting'
import { BitEntity, SettingEntity } from '@mcro/entities'
import { getRepository } from 'typeorm'
import { Logger } from '@mcro/logger'
import { Cosal } from '@mcro/cosal'
import { chunk } from 'lodash'

const log = new Logger('CosalManager')

export class CosalManager {
  cosal: Cosal

  constructor({ cosal }: { cosal: Cosal }) {
    this.cosal = cosal
  }

  get search() {
    return this.cosal.search
  }

  start = () => {
    this.scanSinceLast()
  }

  private async getLastScan() {
    const setting = await getGeneralSetting()
    if (typeof setting.values.cosalIndexUpdatedTo === 'undefined') {
      setting.values.cosalIndexUpdatedTo = 0
      await getRepository(SettingEntity).save(setting)
    }
    return setting.values.cosalIndexUpdatedTo
  }

  scanSinceLast = async () => {
    const lastScanAt = await this.getLastScan()
    const bitsSinceLastScan = await getRepository(BitEntity).find({
      where: { bitUpdatedAt: { $moreThan: lastScanAt } },
    })
    log.info('bitsSinceLastScan', bitsSinceLastScan.length)

    if (!bitsSinceLastScan.length) {
      return
    }

    // scan just a few at a time
    const chunks = chunk(bitsSinceLastScan, 1000)
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
}
