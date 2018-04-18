import { createConnection } from 'typeorm'
import * as Constants from '../constants'
import recoverDB from './recoverDB'
import * as Path from 'path'

export default async function connectModels(models) {
  try {
    await createConnection({
      name: 'default',
      type: 'sqlite',
      database: Path.join(Constants.ROOT_DIR, 'data', 'database'),
      // location: 'default',
      entities: models,
      // logging: true,
      synchronize: true,
    })
  } catch (err) {
    console.log('connectModels Error: ', err)
    const errorType = err.message.slice(0, err.message.indexOf(':'))
    switch (errorType) {
      case 'SQLITE_CORRUPT':
        console.log('corrupted db, recreate from last backup...')
        recoverDB()
    }
  }
}
