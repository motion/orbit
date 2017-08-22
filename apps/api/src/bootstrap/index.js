// @flow
import Path from 'path'
import Couch from './couch'
import Models from './models'
import * as Constants from '~/constants'
import type { Options } from '~/types'

export default class Bootstrap {
  constructor(options: Options) {
    this.couch = new Couch({
      databaseUrl: Constants.COUCH_URL,
      designPath: Path.join(options.rootPath, '..', 'design'),
    })
    this.models = new Models()
  }

  start() {
    this.couch.start()
    this.models.start()
  }

  dispose() {
    this.couch.dispose()
    this.models.dispose()
  }
}
