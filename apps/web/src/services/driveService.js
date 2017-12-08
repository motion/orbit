// @flow
import { store } from '@mcro/black'
import { CurrentUser } from '~/app'

@store
export default class DriveService {
  get setting(): ?string {
    return CurrentUser.setting.drive
  }
}
