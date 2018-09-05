import { Setting, BitModel } from '@mcro/models'
import { IntegrationType } from '../../../models/src'
import { JobRepository, SettingRepository, observeCount } from '../repositories'
import { modelQueryReaction } from '../repositories/modelQueryReaction'

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

  bitsCount = 0
  bitsCounts$ = observeCount(BitModel, {
    args: {
      where: {
        integration: this.setting.type as IntegrationType,
      },
    },
  }).subscribe(value => {
    console.log('got count', value)
    this.bitsCount = value
  })

  willUnmount() {
    this.bitsCounts$.unsubscribe()
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
}
