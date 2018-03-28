import sqlite from 'sqlite'
import fs from 'fs'
import Primus from 'primus'
import Path from 'path'

const log = debug('sqliteServer')

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
      log('  params: ', sql.params, ' sql: ', sql.sql)
    }
  }
}

function onConnection(options, spark) {
  spark.on('data', function(data) {
    let { name } = data.args[0]
    if (typeof name === 'undefined') {
      name = 'database'
    }
    let db = null
    switch (data.command) {
      case 'open':
        log('open: ', databaseDirectory + name)
        break
      case 'close':
        log('close: ', databaseDirectory + data.args[0].path)
        break
      case 'delete':
        log('delete: ', databaseDirectory + data.openargs.dbname)
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
          databasePath = databaseDirectory + name + '.sqlite'
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
          sqlite
            .open(databasePath, {
              cached: true,
              Promise,
            })
            .then(db => {
              db.databaseID = newDatabaseID
              databaseList[newDatabaseID] = db
              databasePathList[name] = db
              spark.write({
                command: 'openComplete',
                id: data.id,
                databaseID: newDatabaseID,
              })
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
        databasePathList[data.args.dbname].close(function(err) {
          spark.write({
            command: 'closeComplete',
            err: err,
            id: data.id,
          })
        })
        break
      case 'delete':
        if (!databasePathList[data.args.dbname]) {
          return
        }
        databasePathList[data.args.dbname].close(function(err) {
          fs.unlinkSync(databaseDirectory + data.openargs.dbname)
          spark.write({
            command: 'deleteComplete',
            err: err,
            id: data.id,
          })
        })
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
        var queryArray = data.args[0].executes
        runQueries(data.id, spark, db, queryArray, [])
    }
  })
}

async function runQueries(id, spark, db, queryArray, accumAnswer) {
  if (queryArray.length < 1) {
    spark.write({
      command: 'backgroundExecuteSqlBatchComplete',
      err: null,
      answer: accumAnswer,
      id: id,
    })
    return
  }
  var top = queryArray.shift()
  var newAnswer = {}
  try {
    const rows = await db.all(top.sql, top.params)
    newAnswer.type = 'success'
    newAnswer.qid = top.qid
    var newResult = {}
    newResult.rows = rows
    newAnswer.result = newResult
    accumAnswer.push(newAnswer)
    runQueries(id, spark, db, queryArray, accumAnswer)
  } catch (err) {
    newAnswer.type = 'error'
    newAnswer.qid = top.qid
    accumAnswer.push(newAnswer)
    log('runFailed: ', err)
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
