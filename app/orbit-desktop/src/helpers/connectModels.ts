import { createConnection } from 'typeorm'
import * as Path from 'path'
import { getConfig } from '../config'

const Config = getConfig()

export default async function connectModels(models) {
  try {
    return await createConnection({
      name: 'default',
      type: 'sqlite',
      database: Path.join(Config.directories.root, 'app_data', 'database'),
      // location: 'default',
      entities: models,
      // logging: true,
      synchronize: true,
    }).then(connection => {
      models.forEach(model => model.useConnection(connection))
      return connection
    })
  } catch (err) {
    console.log('connectModels Error: ', err)
    const errorType = err.message.slice(0, err.message.indexOf(':'))
    switch (errorType) {
      case 'SQLITE_CORRUPT':
        console.log('corrupted db, recreate from last backup...')
      // recoverDB()
    }
  }
}
