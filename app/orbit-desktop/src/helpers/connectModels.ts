import { sleep } from '@o/utils'
import { remove } from 'fs-extra'
import { Connection, ConnectionOptions, createConnection } from 'typeorm'

import { DATABASE_PATH } from '../constants'
import { migrations } from '../migrations'

function buildOptions(models): ConnectionOptions {
  return {
    name: 'default',
    type: 'sqlite',
    database: DATABASE_PATH,
    migrations,
    // location: 'default',
    entities: models,
    logging: ['error'],
    logger: 'simple-console',
    synchronize: true,
    migrationsRun: true,
    busyErrorRetry: 1000,
    maxQueryExecutionTime: 3000,
    // disabling this fixed database re-creation
    // enableWAL: true,
  }
}

const closeConnection = async (connection?: Connection) => {
  if (!connection) return
  try {
    await connection.close()
  } catch (err) {
    // fine, just in case something odd kept it open
    console.log('err closing connection', err)
  }
}

export default async function connectModels(models) {
  // if we cannot create connection it usually means we have some unhandled database schema changes
  // this case must be gracefully handled. We are trying here to drop everything in the database
  // except spaces and apps. Right, this means user is going to loose all its synced data
  // but since spaces and apps are in there application will restart sync
  // in such case we at least don't force people to re-add every added App again
  // to make this schema to work properly its recommended to keep space and app entities simple
  // todo: we need to reset app setting values

  let connection: Connection

  try {
    connection = await createConnection(buildOptions(models))
    return connection
  } catch (err1) {
    console.error(`\n\nerror during connection create: `, err1)
    await closeConnection(connection)

    // if its going to fail this time again we have no choice - we drop all apps and spaces as well
    // and user will have to add spaces, apps and settings from scratch again
    // at least this is better then non responsive application
    try {
      // create connection without synchronizations and migrations running to execute raw SQL queries
      connection = await createConnection({
        ...buildOptions(models),
        migrations: [],
        synchronize: false,
        migrationsRun: false,
      })

      console.log('created connection no synchronize/migrations')

      // maybe no database (was deleted from disk, lets re-create)
      const queryRunner = connection.createQueryRunner()
      if (!(await queryRunner.hasDatabase('default'))) {
        console.log('No database found, re-creating...')
        await queryRunner.createDatabase('default', true)
        await closeConnection(connection)
        return await createConnection(buildOptions(models))
      }

      // execute drop queries
      await Promise.all([
        connection.query(`DROP TABLE IF EXISTS 'bit_entity_people_person_entity'`),
        connection.query(`DROP TABLE IF EXISTS 'job_entity'`),
        connection.query(`DROP TABLE IF EXISTS 'bit_entity'`),
        connection.query(`DROP TABLE IF EXISTS 'person_entity'`),
        connection.query(`DROP TABLE IF EXISTS 'person_bit_entity'`),
        connection.query(`DROP TABLE IF EXISTS 'search_index_entity'`),
      ])

      await closeConnection(connection)

      connection = await createConnection({
        ...buildOptions(models),
        synchronize: true,
        migrationsRun: false,
      })

      // close connection
      await closeConnection(connection)

      // create create connection again
      connection = await createConnection(buildOptions(models))
      return connection
    } catch (err2) {
      console.error(
        `\n\nsecond error during connection create, can't recover so lets re-create: `,
        err2,
      )

      await closeConnection(connection)

      // create connection without synchronizations and migrations running to execute raw SQL queries
      connection = await createConnection({
        ...buildOptions(models),
        synchronize: false,
        migrationsRun: false,
      })

      // 😮 TODO
      // we should really save their data into a simple JSON object at the very least here
      // 😮 TODO

      try {
        // execute drop queries
        await Promise.all([
          connection.query(`DROP TABLE IF EXISTS 'bit_entity_people_person_entity'`),
          connection.query(`DROP TABLE IF EXISTS 'job_entity'`),
          connection.query(`DROP TABLE IF EXISTS 'bit_entity'`),
          connection.query(`DROP TABLE IF EXISTS 'person_entity'`),
          connection.query(`DROP TABLE IF EXISTS 'person_bit_entity'`),
          connection.query(`DROP TABLE IF EXISTS 'search_index_entity'`),
          connection.query(`DROP TABLE IF EXISTS 'setting_entity'`),
          connection.query(`DROP TABLE IF EXISTS 'app_entity_spaces_space_entity'`),
          connection.query(`DROP TABLE IF EXISTS 'app_entity'`),
          connection.query(`DROP TABLE IF EXISTS 'app_entity'`),
          connection.query(`DROP TABLE IF EXISTS 'setting_entity'`),
          connection.query(`DROP TABLE IF EXISTS 'space_entity'`), // maybe we should remove them next step instead? (and make apps to be retrieved from spaces),
        ])

        // close connection
        await closeConnection(connection)

        return await createConnection(buildOptions(models))
      } catch (err) {
        console.log('step 4 failed..........', err)
      }

      // holy shit things went wrong. fucking hell... lets nuke.
      console.log('going nuclear!')
      await remove(DATABASE_PATH)
      await sleep(500)
      await closeConnection(connection)

      console.log('now re-connect from scratch')

      return await createConnection(buildOptions(models))
    }
  }
}
