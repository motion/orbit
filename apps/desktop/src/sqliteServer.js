import sqlite from 'sqlite'
import fs from 'fs'
import Primus from 'primus'
import Path from 'path'

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

let lock
let queue = []
let numConnections = 0

async function processQueue() {
  if (!queue.length) return
  lock = 'special'
  while (queue.length) {
    await runWithLock(...queue.shift())
  }
  lock = null
  if (queue.length) processQueue()
}

async function runWithLock(uid, run) {
  if (lock && lock !== uid) {
    queue.push(run)
  } else {
    await run()
    if (!lock) {
      processQueue()
    }
  }
}

function onConnection(options, spark) {
  let uid = ++numConnections
  spark.on('data', data => {
    const run = () => onData(options, spark, data, uid)
    runWithLock(uid, run)
  })
}

async function onData(options, spark, data, uid) {
  let { name } = data.args[0]
  // if (typeof name === 'undefined') {
  //   name = 'database'
  // }
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
  switch (data.command) {
    case 'open':
      var databasePath = null
      if (options.forceMemory) {
        databasePath = ':memory:'
      } else {
        databasePath = databaseDirectory + name
      }
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
        var newDatabaseID = databaseID++
        // https://github.com/mapbox/node-sqlite3/wiki/Caching
        const db = await sqlite.open(databasePath, {
          cached: true,
          Promise,
        })
        db.databaseID = newDatabaseID
        databaseList[newDatabaseID] = db
        databasePathList[name] = db
        spark.write({
          command: 'openComplete',
          id: data.id,
          databaseID: newDatabaseID,
        })
      }
      break
    case 'close':
      if (!databasePathList[data.args.dbname]) {
        spark.write({
          command: 'closeComplete',
          err: null,
          id: data.id,
        })
        return
      }
      let err
      try {
        await databasePathList[data.args.dbname].close()
      } catch (e) {
        err = e
      }
      spark.write({
        command: 'closeComplete',
        err,
        id: data.id,
      })
      break
    case 'delete':
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
        log('runFailed: db not found')
        spark.write({
          command: 'backgroundExecuteSqlBatchFailed',
          err: 'runFailed: db not found',
          id: data.id,
        })
        return
      }
      // console.log('setting query array', JSON.stringify(data))
      const queries = data.args[0].executes
      if (queries[0].sql === 'BEGIN TRANSACTION') {
        lock = uid
      }
      if (queries[0].sql.indexOf('END TRANSACTION') === 0) {
        lock = null
      }
      await runQueries(data.id, spark, db, queries, [])
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
    console.log('error!', queryArray, top, accumAnswer, err)
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
