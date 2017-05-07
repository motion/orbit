import BaseModel from './baseModel'

export { query } from './query'

export { bool, int, str, object, array } from 'kontur'

export class Model extends BaseModel {
  constructor() {
    super({
      defaultSchema: {
        primaryPath: '_id',
        version: 0,
        disableKeyCompression: true,
      },
    })
  }
}
