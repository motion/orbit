// import { react } from '@mcro/black'
import { Setting } from '@mcro/models'
import { BitRepository, JobRepository } from '../repositories'
import { modelQueryReaction } from '../repositories/modelQueryReaction'

// TODO: we can have multiple of the same integration added in
// this just assumes one of each

export class SettingInfoStore {
  props: {
    setting: Setting
  }

  get setting() {
    return this.props.setting
  }

  job = modelQueryReaction(
    async () => {
      return await JobRepository.findOne({
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
      BitRepository.count({
        integration: this.setting.type,
      }),
    {
      immediate: true,
      condition: () => !!this.setting,
    },
  )
}
