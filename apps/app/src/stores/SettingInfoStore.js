// import { react } from '@mcro/black'
import { Bit, Job } from '@mcro/models'
import { modelQueryReaction } from '@mcro/helpers'
import { now } from 'mobx-utils'

export class SettingInfoStore {
  job = null
  bitsCount = null
  bit = null
  updateJob = 0

  get setting() {
    if (!this.bit) return
    return this.props.appStore.settings[this.bit.integration]
  }

  setBit = bit => {
    this.bit = bit
  }

  job = modelQueryReaction(
    () => [now(2000), this.updateJob],
    async () => {
      if (this.bit) {
        return await Job.findOne({
          where: { type: this.bit.integration },
          order: { createdAt: 'DESC' },
        })
      }
    },
  )

  bitsCount = modelQueryReaction(
    () => [this.bit, now(4000)],
    ([bit]) =>
      bit &&
      Bit.createQueryBuilder()
        .where({ integration: this.bit.integration })
        .getCount(),
    { immediate: true },
  )
}
