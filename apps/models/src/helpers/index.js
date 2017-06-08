import BaseModel from './baseModel'

export { query } from '@jot/black'

export * from './properties'

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
