import couchBootstrap from 'starter-couch'
import { COUCH_URL } from './keys'

export default class Bootstrap {
  start() {
    console.log(COUCH_URL, couchBootstrap)
    couchBootstrap(COUCH_URL)
  }
}
