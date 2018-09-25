import { createConnection } from 'typeorm'
import { DATABASE_PATH } from '../constants'

export default async function connectModels(models) {
  try {
    return await createConnection({
      name: 'default',
      type: 'sqlite',
      database: DATABASE_PATH,
      // location: 'default',
      entities: models,
      logging: ['error'],
      logger: 'simple-console',
      synchronize: true,
      busyErrorRetry: 1000,
      enableWAL: true,

    }).then(connection => {
      models.forEach(model => model.useConnection(connection))
      return connection
    })
  } catch (err) {
    console.log('connectModels Error: ', err)
    const errorType = err.message.slice(0, err.message.indexOf(':'))
    switch (errorType) {
      case 'SQLITE_CORRUPT':
        console.log('corrupted db!!!!!!!!!!\n\n\n')
    }
  }
}
