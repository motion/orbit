import { sleep } from '@mcro/black'
import { loadMany } from '@mcro/model-bridge'
import { BitModel } from '@mcro/models'

export class PeekRelatedStore {
  relatedBits = null

  async didMount() {
    await sleep(50)
    this.relatedBits = await loadMany(BitModel, {
      args: {
        take: 6,
        skip: 2,
        relations: ['people'],
      }
    })
  }
}
