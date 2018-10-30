import { BitModel, SettingModel, JobModel, Setting } from '@mcro/models'
import { observeCount, observeOne } from '@mcro/model-bridge'

export type AppInfoProps = {
  settingId?: number
  model?: Setting
  setting?: Setting
}

export class AppInfoStore {
  props: AppInfoProps

  get settingId() {
    return +(this.props.model || this.props.setting || { id: null }).id || this.props.settingId
  }

  bitsCount = 0
  private bitsCounts$ = observeCount(BitModel, {
    args: {
      settingId: this.settingId,
    },
  }).subscribe(value => {
    this.bitsCount = value
  })

  setting: Setting = null
  private setting$ = observeOne(SettingModel, {
    args: {
      where: {
        id: this.settingId,
      },
    },
  }).subscribe(value => {
    this.setting = value
  })

  job = null
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
