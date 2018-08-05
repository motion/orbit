import { BitRepository } from '../../../repositories'

export class PeekRelatedStore {
  relatedBits = null

  async didMount() {
    this.relatedBits = await BitRepository.find({
      take: 6,
      skip: 2,
      relations: ['people'],
    })
  }
}
