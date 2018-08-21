// import { react } from '@mcro/black'
import { Setting } from '@mcro/models'
import { IntegrationType } from '../../../models/src'
import { BitRepository, JobRepository } from '../repositories'
import { modelQueryReaction } from '../repositories/modelQueryReaction'
import { react } from '@mcro/black'

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

  bitsCount = react(async () => {
    if (!this.setting) {
      return 0
    }
    return await BitRepository.count({
      integration: this.setting.type as IntegrationType,
    })
  })
}
