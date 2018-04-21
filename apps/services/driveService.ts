import { store } from '@mcro/black/store'
import { Setting } from '@mcro/models'

@store
export class DriveService {
  setting: Setting

  constructor(setting) {
    this.setting = setting
  }
}
