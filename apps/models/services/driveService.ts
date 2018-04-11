import { store } from '@mcro/black/store'
import { Setting } from '../setting'

@store
export class DriveService {
  setting: Setting

  constructor(setting) {
    this.setting = setting
  }
}
