import { AppBit, AppBitEntity } from '@mcro/models'
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

    try {
      connection.close()
    } catch {
      // fine, just in case something odd kept it open
    }

    // if its going to fail this time again we have no choice - we drop all apps and spaces as well
    // and user will have to add spaces, apps and settings from scratch again
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

      // reset app last sync settings, since we are going to start it from scratch
      try {
        const apps = (await connection.getRepository(AppBitEntity).find()) as AppBit[]
        for (let app of apps) {
          if (app.appType === 'confluence') {
            app.data.values.blogLastSync = {}
            app.data.values.pageLastSync = {}
          } else if (app.appType === 'github') {
            app.data.values.lastSyncIssues = {}
            app.data.values.lastSyncPullRequests = {}
          } else if (app.appType === 'drive') {
            app.data.values.lastSync = {}
          } else if (app.appType === 'gmail') {
            // app.data.values.lastSync = {} // todo: do after my another PR merge
          } else if (app.appType === 'jira') {
            app.data.values.lastSync = {}
          } else if (app.appType === 'slack') {
            app.data.values.lastMessageSync = {}
            app.data.values.lastAttachmentSync = {}
          }
        }

        await connection.getRepository(AppBitEntity).save(apps)
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
        await connection.query(`DROP TABLE IF EXISTS 'app_entity_spaces_space_entity'`)
        await connection.query(`DROP TABLE IF EXISTS 'app_entity'`)
        await connection.query(`DROP TABLE IF EXISTS 'app_entity'`)
        await connection.query(`DROP TABLE IF EXISTS 'setting_entity'`)
        await connection.query(`DROP TABLE IF EXISTS 'space_entity'`) // maybe we should remove them next step instead? (and make apps to be retrieved from spaces)

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
