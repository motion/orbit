import BaseModel from './baseModel'

// exports
export { query } from 'motion-mobx-helpers'

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

export const idFn = _ => _
