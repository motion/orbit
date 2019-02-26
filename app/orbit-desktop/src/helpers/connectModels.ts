import { Source, SourceEntity } from '@mcro/models'
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
    enableWAL: true,
  }
}

export default async function connectModels(models) {
  // if we cannot create connection it usually means we have some unhandled database schema changes
  // this case must be gracefully handled. We are trying here to drop everything in the database
  // except spaces and sources. Right, this means user is going to loose all its synced data
  // but since spaces and sources are in there application will restart sync
  // in such case we at least don't force people to re-add every added Source again
  // to make this schema to work properly its recommended to keep space and source entities simple
  // todo: we need to reset source setting values

  let connection: Connection

  try {
    connection = await createConnection(buildOptions(models))
    return connection
  } catch (err1) {
    console.error(`\n\nerror during connection create: `, err1)

    try {
      connection.close()
    } catch {
      // fine, just in case something odd kept it open
    }

    // if its going to fail this time again we have no choice - we drop all sources and spaces as well
    // and user will have to add spaces, sources and settings from scratch again
    // at least this is better then non responsive application
    try {
      // create connection without synchronizations and migrations running to execute raw SQL queries
      connection = await createConnection({
        ...buildOptions(models),
        synchronize: false,
        migrationsRun: false,
      })

      // execute drop queries
      await connection.query(`DROP TABLE IF EXISTS 'bit_entity_people_person_entity'`)
      await connection.query(`DROP TABLE IF EXISTS 'job_entity'`)
      await connection.query(`DROP TABLE IF EXISTS 'bit_entity'`)
      await connection.query(`DROP TABLE IF EXISTS 'person_entity'`)
      await connection.query(`DROP TABLE IF EXISTS 'person_bit_entity'`)
      await connection.query(`DROP TABLE IF EXISTS 'search_index_entity'`)

      await connection.close()

      connection = await createConnection({
        ...buildOptions(models),
        synchronize: true,
        migrationsRun: false,
      })

      // reset source last sync settings, since we are going to start it from scratch
      try {
        const sources: Source[] = await connection.getRepository(SourceEntity).find()
        for (let source of sources) {
          if (source.type === 'confluence') {
            source.values.blogLastSync = {}
            source.values.pageLastSync = {}
          } else if (source.type === 'github') {
            source.values.lastSyncIssues = {}
            source.values.lastSyncPullRequests = {}
          } else if (source.type === 'drive') {
            source.values.lastSync = {}
          } else if (source.type === 'gmail') {
            // source.values.lastSync = {} // todo: do after my another PR merge
          } else if (source.type === 'jira') {
            source.values.lastSync = {}
          } else if (source.type === 'slack') {
            source.values.lastMessageSync = {}
            source.values.lastAttachmentSync = {}
          }
        }

        await connection.getRepository(SourceEntity).save(sources)
      } catch {
        console.log('failed with method 2')
      }

      // close connection
      await connection.close()

      // create create connection again
      connection = await createConnection(buildOptions(models))
      return connection
    } catch (err2) {
      console.error(
        `\n\nsecond error during connection create, can't recover so lets re-create: `,
        err2,
      )

      try {
        await connection.close()
      } catch {
        // it may have been left open in previous block, or may not in which case its fine
      }

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
        await connection.query(`DROP TABLE IF EXISTS 'bit_entity_people_person_entity'`)
        await connection.query(`DROP TABLE IF EXISTS 'job_entity'`)
        await connection.query(`DROP TABLE IF EXISTS 'bit_entity'`)
        await connection.query(`DROP TABLE IF EXISTS 'person_entity'`)
        await connection.query(`DROP TABLE IF EXISTS 'person_bit_entity'`)
        await connection.query(`DROP TABLE IF EXISTS 'search_index_entity'`)
        await connection.query(`DROP TABLE IF EXISTS 'setting_entity'`)
        await connection.query(`DROP TABLE IF EXISTS 'source_entity_spaces_space_entity'`)
        await connection.query(`DROP TABLE IF EXISTS 'source_entity'`)
        await connection.query(`DROP TABLE IF EXISTS 'app_entity'`)
        await connection.query(`DROP TABLE IF EXISTS 'setting_entity'`)
        await connection.query(`DROP TABLE IF EXISTS 'space_entity'`) // maybe we should remove them next step instead? (and make sources to be retrieved from spaces)

        // close connection
        await connection.close()

        return await createConnection(buildOptions(models))
      } catch (err) {
        console.log('step 4 failed..........', err)
      }

      // holy shit things went wrong. fucking hell... lets nuke.
      console.log('going nuclear!')
      await remove(DATABASE_PATH)

      return await createConnection(buildOptions(models))
    }
  }
}
