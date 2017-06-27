import couchBootstrap from '@jot/couch'
import * as Constants from './constants'

export default class Bootstrap {
  start() {
    couchBootstrap(Constants.COUCH_URL)
  }
}
