// @flow
import global from 'global'
import { Model, object, str } from '@mcro/model'

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
  }
}

const SettingInstance = new SettingModel()
global.Setting = SettingInstance

export default SettingInstance
