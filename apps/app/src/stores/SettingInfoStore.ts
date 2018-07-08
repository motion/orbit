// import { react } from '@mcro/black'
import { Bit, Job } from '@mcro/models'
import { modelQueryReaction } from '@mcro/helpers'

// TODO: we can have multiple of the same integration added in
// this just assumes one of each

export class SettingInfoStore {
  job = null
  bitsCount = null

  get setting() {
    return this.props.setting
  }

  job = modelQueryReaction(
    async () => {
      return await Job.findOne({
        where: { type: this.setting.type },
        order: { createdAt: 'DESC' },
      })
    },
    {
      immediate: true,
      condition: () => !!this.setting,
    },
  )

  bitsCount = modelQueryReaction(
    () =>
      Bit.createQueryBuilder()
        .where({ integration: this.setting.type })
        .getCount(),
    {
      immediate: true,
      condition: () => !!this.setting,
    },
  )
}
