import { Logger } from '@mcro/logger'
import { getRepository } from '@mcro/mediator/node_modules/typeorm'
import { BitEntity } from '../entities/BitEntity'

const log = new Logger('CosalManager')

export class CosalManager {
  start = () => {
    this.scanSinceLast()
  }

  scanSinceLast = async () => {
    // const bits = await getRepository(BitEntity).find()
    // for (const bit of bits) {
    // }
  }
}
