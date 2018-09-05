import { BitModel, SettingModel, JobModel } from '@mcro/models'
import { observeCount, observeOne } from '../repositories'

export type SettingInfoProps = {
  settingId: number
}

export class SettingInfoStore {
  props: SettingInfoProps

  setting = null
  bitsCount = 0
  job = null

  private setting$ = observeOne(SettingModel, {
    args: {
      where: {
        id: this.props.settingId,
      },
    },
  }).subscribe(value => {
    this.setting = value
  })

  private bitsCounts$ = observeCount(BitModel, {
    args: {
      settingId: this.props.settingId,
    },
  }).subscribe(value => {
    console.log('got count', value)
    this.bitsCount = value
  })

  private job$ = observeOne(JobModel, {
    args: {
      where: { settingId: this.props.settingId },
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
