import { store } from '@mcro/black/store'
import { CurrentUser } from '@mcro/models'

@store
export default class DriveService {
  get setting() {
    return CurrentUser.setting.drive
  }
}
