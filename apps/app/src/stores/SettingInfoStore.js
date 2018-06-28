// import { react } from '@mcro/black'
import { Bit, Job } from '@mcro/models'
import { modelQueryReaction } from '@mcro/helpers'

export class SettingInfoStore {
  job = null
  bitsCount = null
  bit = null
  updateJob = 1

  get setting() {
    if (!this.bit) {
      return
    }
    if (!this.props.appStore.settings) {
      return
    }
    return this.props.appStore.settings[this.bit.integration]
  }

  setBit = bit => {
    this.bit = bit
  }

  job = modelQueryReaction(
    async () => {
      if (this.bit) {
        return await Job.findOne({
          where: { type: this.bit.integration },
          order: { createdAt: 'DESC' },
        })
      }
    },
    {
      immediate: true,
      condition: () => this.updateJob,
    },
  )

  bitsCount = modelQueryReaction(
    () =>
      Bit.createQueryBuilder()
        .where({ integration: this.bit.integration })
        .getCount(),
    {
      immediate: true,
      condition: () => !!this.bit,
    },
  )
}
