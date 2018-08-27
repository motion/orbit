import { createConnection } from 'typeorm'
import * as Path from 'path'
import { getGlobalConfig } from '@mcro/config'

const Config = getGlobalConfig()
const env = process.env.NODE_ENV !== 'development' ? 'orbit' : 'dev'

export default async function connectModels(models) {
  try {
    return await createConnection({
      name: 'default',
      type: 'sqlite',
      database: Path.join(Config.paths.userData, `${env}_database.sqlite`),
      // location: 'default',
      entities: models,
      logging: ['error'],
      logger: 'simple-console',
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
        console.log('corrupted db!!!!!!!!!!\n\n\n')
    }
  }
}
