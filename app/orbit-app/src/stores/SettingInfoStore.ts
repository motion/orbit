// import { react } from '@mcro/black'
import { Setting } from '@mcro/models'
import { IntegrationType } from '../../../models/src'
import { BitRepository, JobRepository } from '../repositories'
import { modelQueryReaction } from '../repositories/modelQueryReaction'

// TODO: we can have multiple of the same integration added in
// this just assumes one of each

export class SettingInfoStore {
  props: {
    model: Setting
  }

  get setting() {
    return this.props.model
  }

  job = modelQueryReaction(
    async () => {
      return await JobRepository.findOne({
        where: { settingId: this.setting.id },
        order: { id: 'DESC' },
      })
    },
    {
      condition: () => !!this.setting,
    },
  )

  bitsCount = modelQueryReaction(
    () =>
      BitRepository.count({
        integration: this.setting.type as IntegrationType,
      }),
    {
      condition: () => !!this.setting,
    },
  )
}
