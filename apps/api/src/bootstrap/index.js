import Path from 'path'
import Couch from './couch'
import * as Constants from '~/constants'
import type { Options } from '~/types'

export default class Bootstrap {
  constructor(options: Options) {
    this.couch = new Couch({
      databaseUrl: Constants.COUCH_URL,
      designPath: Path.join(options.rootPath, '..', 'design'),
    })
  }

  start() {
    this.couch.start()
  }

  dispose() {
    this.couch.dispose()
  }
}
