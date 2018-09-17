import { BitModel, SettingModel, JobModel, Setting } from '@mcro/models'
import { observeCount, observeOne, loadOne } from '../repositories'

export type AppInfoProps = {
  settingId?: number
  model?: Setting
}

export class AppInfoStore {
  props: AppInfoProps

  setting = null
  bitsCount = 0
  job = null

  // todo remove
  async didMount() {
    this.setting = await loadOne(SettingModel, { args: { where: { id: this.settingId } } })
  }

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
    if (value) {
      this.setting = value
    }
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
