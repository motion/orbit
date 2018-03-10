// @flow
import global from 'global'
import { Model, object, str } from '@mcro/model'
import * as Constants from '~/constants'

let Setting

export class SettingModel extends Model {
  static props = {
    type: str,
    values: object,
    userId: str,
    timestamps: true,
  }

  static defaultProps = {
    values: {},
    userId: 'abc@123.com',
  }

  hooks = {
    preInsert: async (doc: Object) => {
      if (doc.type && (await Setting.get({ type: doc.type }))) {
        throw new Error(`Setting already exists with this url`)
      }
    },
  }

  settings = {
    database: 'settings',
    // autoSync: {
    //   // push settings if auth pane
    //   push: Constants.AUTH_SERVICE,
    //   pull: false, //'basic',
    // },
  }
}

Setting = new SettingModel()
global.Setting = Setting

export default Setting
