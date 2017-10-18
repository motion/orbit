// @flow
import global from 'global'
import { Model, object, str } from '@mcro/model'
import * as Constants from '~/constants'
import { uniq } from 'lodash'

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

  methods = {
    get orgs() {
      return uniq(
        Object.keys(this.values.repos || {}).map(x => x.split('/')[0])
      )
    },
  }
}

const SettingInstance = new SettingModel()
global.Setting = SettingInstance

export default SettingInstance
