import { BitRepository } from '../../../repositories'
import { sleep } from '@mcro/black'

export class PeekRelatedStore {
  relatedBits = null

  async didMount() {
    await sleep(50)
    this.relatedBits = await BitRepository.find({
      take: 6,
      skip: 2,
      relations: ['people'],
    })
  }
}
