import sqlite from 'sqlite'
import fs from 'fs'
import Primus from 'primus'
import * as Path from 'path'
import recoverDB from '~/helpers/recoverDB'
import debug from '@mcro/debug'

const log = debug('sqliteServer')
debug.quiet('sqliteServer')

var databaseID = 0
var databaseList = []
var databasePathList = []
var databaseDirectory = Path.join(__dirname, '..', 'data/')

function prettyPrintArgs(args) {
  var first = true
  for (var e of args) {
    if (first) {
      first = false
    }
    for (var sql of e.executes) {
      log('\n params:', sql.params, '\n sql: ', sql.sql)
    }
  }
}

let id = 1
let txLock = null
let queue = []

function finishLock() {
  txLock = null
  const running = [...queue]
  queue = []
  for (const [a, b, c, d] of running) {
    onData(a, b, c, d)
  }
}

function onConnection(options, spark) {
  let uid = ++id
  spark.on('data', data => {
    if (txLock && txLock !== uid) {
      queue.push([options, spark, data, uid])
      return
    }
    onData(options, spark, data, uid)
  })
}

async function onData(options, spark, data, uid) {
  let { name } = data.args[0]
  if (typeof name === 'undefined') {
    name = 'database'
  }
  let db = null
  switch (data.command) {
    case 'open':
      log('open:', databaseDirectory + name)
      break
    case 'close':
      log('close:', databaseDirectory + data.args[0].path)
      break
    case 'delete':
      log('delete:', databaseDirectory + data.openargs.dbname)
      break
    case 'backgroundExecuteSqlBatch':
      prettyPrintArgs(data.args)
      break
  }

  async function openDb(name) {
    var databasePath = null
    if (options.forceMemory) {
      databasePath = ':memory:'
    } else {
      databasePath = databaseDirectory + name
    }
    var newDatabaseID = databaseID++
    // https://github.com/mapbox/node-sqlite3/wiki/Caching
    const db = await sqlite.open(databasePath, {
      // cached: true,
      promise: Promise,
    })
    // @ts-ignore
    db.databaseID = newDatabaseID
    databaseList[newDatabaseID] = db
    databasePathList[name] = db
    return newDatabaseID
  }

  switch (data.command) {
    case 'open':
      // first check if its already opened
      if (databasePathList[name]) {
        spark.write({
          command: 'openComplete',
          err: null,
          id: data.id,
          databaseID: databasePathList[name].databaseID,
        })
        // else open it
      } else {
        const newDatabaseID = await openDb(name)
        spark.write({
          command: 'openComplete',
          id: data.id,
          databaseID: newDatabaseID,
        })
      }
      break
    case 'close':
      spark.write({
        command: 'closeComplete',
        err: null,
        id: data.id,
      })
      // dont close because we have many clients connecting!
      // if (!databasePathList[data.args.dbname]) {
      //   return
      // }
      // let err
      // try {
      //   await databasePathList[data.args.dbname].close()
      // } catch (e) {
      //   err = e
      // }
      // spark.write({
      //   command: 'closeComplete',
      //   err,
      //   id: data.id,
      // })
      break
    case 'delete':
      console.log('wants to delete omg')
      if (!databasePathList[data.args.dbname]) {
        return
      }
      let error
      try {
        await databasePathList[data.args.dbname].close()
      } catch (e) {
        error = e
        fs.unlinkSync(databaseDirectory + data.openargs.dbname)
      } finally {
        spark.write({
          command: 'deleteComplete',
          err: error,
          id: data.id,
        })
      }
      break
    case 'backgroundExecuteSqlBatch':
      db = databasePathList[data.args[0].dbargs.dbname]
      if (!db) {
        // if desktop was interrupted, try re-opening
        try {
          await openDb(data.args[0].dbargs.dbname)
          db = databasePathList[data.args[0].dbargs.dbname]
        } catch (err) {
          console.log('error opening', err)
        }
        if (!db) {
          spark.write({
            command: 'backgroundExecuteSqlBatchFailed',
            err: `runFailed: db not found`,
            id: data.id,
          })
          return
        }
      }
      const queries = data.args[0].executes
      const sql = `${queries[0].sql}`
      if (sql === 'BEGIN TRANSACTION') {
        txLock = uid
      }
      await runQueries(data.id, spark, db, queries, [])
      if (sql === 'COMMIT') {
        finishLock()
      }
  }
}

async function runQueries(id, spark, db, queryArray, accumAnswer) {
  if (queryArray.length < 1) {
    // log('runQueries answering with:', accumAnswer)
    spark.write({
      command: 'backgroundExecuteSqlBatchComplete',
      err: null,
      answer: accumAnswer,
      id: id,
    })
    return
  }
  var top = queryArray.shift()
  try {
    const rows = await db.all(top.sql, top.params)
    accumAnswer.push({
      type: 'success',
      qid: top.qid,
      result: { rows },
    })
    await runQueries(id, spark, db, queryArray, accumAnswer)
  } catch (err) {
    if (err.message && err.message.indexOf('SQLITE_IOERR')) {
      recoverDB()
    }
    accumAnswer.push({
      type: 'error',
      qid: top.qid,
    })
    spark.write({
      command: 'backgroundExecuteSqlBatchFailed',
      err: err.toString(),
      answer: accumAnswer,
      id: id,
    })
  }
}

export default class SQLiteServer {
  constructor() {
    Primus.createServer(spark => onConnection({ forceMemory: false }, spark), {
      port: 8082,
      transformer: 'websockets',
      iknowhttpsisbetter: true,
    })
  }
}
