import { BitModel, SettingModel, JobModel, Setting } from '@mcro/models'
import { observeCount, observeOne } from '../repositories'

export type SettingInfoProps = {
  settingId?: number
  model?: Setting
}

export class SettingInfoStore {
  props: SettingInfoProps

  setting = null
  bitsCount = 0
  job = null

  get settingId() {
    return this.props.model ? this.props.model.id : this.props.settingId
  }

  private setting$ = observeOne(SettingModel, {
    args: {
      where: {
        id: this.settingId,
      },
    },
  }).subscribe(value => {
    this.setting = value
  })

  private bitsCounts$ = observeCount(BitModel, {
    args: {
      settingId: this.settingId,
    },
  }).subscribe(value => {
    console.log('got count', value)
    this.bitsCount = value
  })

  private job$ = observeOne(JobModel, {
    args: {
      where: { settingId: this.settingId },
      order: { id: 'DESC' },
    },
  }).subscribe(value => {
    this.job = value
  })

  willUnmount() {
    this.bitsCounts$.unsubscribe()
    this.setting$.unsubscribe()
    this.job$.unsubscribe()
  }
}
