// @flow
import global from 'global'
import { Model, object, str } from '@mcro/model'
import * as Constants from '~/constants'

export class SettingModel extends Model {
  static props = {
    type: str,
    values: object,
    userId: str,
    timestamps: true,
  }

  static defaultProps = {
    values: {},
  }

  settings = {
    database: 'settings',
    autoSync: {
      // push settings if auth pane
      push: Constants.AUTH_SERVICE,
      pull: false, //'basic',
    },
  }
}

const SettingInstance = new SettingModel()
global.Setting = SettingInstance

export default SettingInstance
