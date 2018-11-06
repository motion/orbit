import { SourceEntity } from '@mcro/entities/_'
import { Source } from '@mcro/models/_'
import { ConnectionOptions, createConnection } from 'typeorm'
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
  // in such case we at least don't force people to re-add every added integration again
  // to make this schema to work properly its recommended to keep space and source entities simple
  // todo: we need to reset source setting values

  try {
    return await createConnection(buildOptions(models))
  } catch (err1) {
    console.error(`error during connection create: `, err1)

    // create connection without synchronizations and migrations running to execute raw SQL queries
    const connection1 = await createConnection({ ...buildOptions(models), synchronize: false, migrationsRun: false })

    // execute drop queries
    await connection1.query(`DROP TABLE IF EXISTS 'bit_entity_people_person_entity'`)
    await connection1.query(`DROP TABLE IF EXISTS 'job_entity'`)
    await connection1.query(`DROP TABLE IF EXISTS 'bit_entity'`)
    await connection1.query(`DROP TABLE IF EXISTS 'person_entity'`)
    await connection1.query(`DROP TABLE IF EXISTS 'person_bit_entity'`)
    await connection1.query(`DROP TABLE IF EXISTS 'search_index_entity'`)

    // reset source last sync settings, since we are going to start it from scratch
    const sources: Source[] = await connection1.getRepository(SourceEntity).find()
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
    await connection1.getRepository(SourceEntity).save(sources)

    // close connection
    await connection1.close()

    // create create connection again
    // if its going to fail this time again we have no choice - we drop all sources and spaces as well
    // and user will have to add spaces, sources and settings from scratch again
    // at least this is better then non responsive application
    try {
      return await createConnection(buildOptions(models))

    } catch (err2) {
      console.error(`second error during connection create: `, err2)

      // create connection without synchronizations and migrations running to execute raw SQL queries
      const connection2 = await createConnection({ ...buildOptions(models), synchronize: false, migrationsRun: false })

      // execute drop queries
      await connection2.query(`DROP TABLE IF EXISTS 'bit_entity_people_person_entity'`)
      await connection2.query(`DROP TABLE IF EXISTS 'job_entity'`)
      await connection2.query(`DROP TABLE IF EXISTS 'bit_entity'`)
      await connection2.query(`DROP TABLE IF EXISTS 'person_entity'`)
      await connection2.query(`DROP TABLE IF EXISTS 'person_bit_entity'`)
      await connection2.query(`DROP TABLE IF EXISTS 'search_index_entity'`)
      await connection2.query(`DROP TABLE IF EXISTS 'source_entity'`)
      await connection2.query(`DROP TABLE IF EXISTS 'source_entity'`)
      await connection2.query(`DROP TABLE IF EXISTS 'setting_entity'`)

      // close connection
      await connection2.close()

      // last chance. create connection again. this time it should work
      return await createConnection(buildOptions(models))
    }
  }
}
