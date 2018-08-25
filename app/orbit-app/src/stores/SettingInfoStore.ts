// import { react } from '@mcro/black'
import { Setting } from '@mcro/models'
import { IntegrationType } from '../../../models/src'
import {
  BitRepository,
  JobRepository,
  SettingRepository,
} from '../repositories'
import { modelQueryReaction } from '../repositories/modelQueryReaction'
import { react } from '@mcro/black'

// TODO: we can have multiple of the same integration added in
// this just assumes one of each

export class SettingInfoStore {
  props: {
    model: Setting
    result: { id: string; [key: string]: any }
  }

  setting = modelQueryReaction(() =>
    SettingRepository.findOne(`${(this.props.model || this.props.result).id}`),
  )

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
    console.log('count by type', this.setting.type)
    return await BitRepository.count({
      integration: this.setting.type as IntegrationType,
    })
  })
}
