import couchBootstrap from 'starter-couch'
import { COUCH_URL } from './keys'

export default class Bootstrap {
  start() {
    couchBootstrap(COUCH_URL)
  }
}
