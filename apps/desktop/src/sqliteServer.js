import sqlite3 from 'sqlite3'
import fs from 'fs'
import Primus from 'primus'
import Path from 'path'

var databaseID = 0
var databaseList = []
var databasePathList = []
var databaseDirectory = Path.join(__dirname, '..', 'data/')

function prettyPrintArgs(args) {
  var first = true
  for (var e of args) {
    if (first) {
      console.log('backgroundExecuteSqlBatch: ', e.dbargs.dbname)
      first = false
    }
    for (var sql of e.executes) {
      console.log('  params: ', sql.params, ' sql: ', sql.sql)
    }
  }
}

function onConnection(options, spark) {
  console.log('connection occured')

  spark.on('data', function(data) {
    var db = null

    switch (data.command) {
      case 'open':
        console.log('open: ', databaseDirectory + data.args[0].name)
        break
      case 'close':
        console.log('open: ', databaseDirectory + data.args.dbname)
        break
      case 'delete':
        console.log('delete: ', databaseDirectory + data.openargs.dbname)
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
          databasePath = databaseDirectory + data.args[0].name
        }

        // first check if its already opened
        if (databasePathList[data.args[0].name]) {
          spark.write({
            command: 'openComplete',
            err: null,
            id: data.id,
            databaseID: databasePathList[data.args[0].name].databaseID,
          })
          // else open it
        } else {
          var newDatabaseID = databaseID++
          // https://github.com/mapbox/node-sqlite3/wiki/Caching
          db = new sqlite3.cached.Database(databasePath, null, function(err) {
            // TODO why is this not printing??
            console.log('openComplete: err: ', err)
          })
          db.on('open', function(err) {
            spark.write({
              command: 'openComplete',
              err: err,
              id: data.id,
              databaseID: newDatabaseID,
            })
          })
          db.databaseID = newDatabaseID
          databaseList[newDatabaseID] = db
          databasePathList[data.args[0].name] = db
        }
        break
      case 'close':
        if (!databasePathList[data.args.dbname]) {
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
          console.log('runFailed: db not found')
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

function runQueries(id, spark, db, queryArray, accumAnswer) {
  if (queryArray.length < 1) {
    spark.write({
      command: 'backgroundExecuteSqlBatchComplete',
      answer: accumAnswer,
      id: id,
    })
    return
  }
  var top = queryArray.shift()
  db.all(top.sql, top.params, function(err, rows) {
    var newAnswer = {}
    if (err) {
      newAnswer.type = 'error'
      newAnswer.qid = top.qid
      accumAnswer.push(newAnswer)
      console.log('runFailed: ', err)
      spark.write({
        command: 'backgroundExecuteSqlBatchFailed',
        err: err.toString(),
        answer: accumAnswer,
        id: id,
      })
      return
    }
    newAnswer.type = 'success'
    newAnswer.qid = top.qid
    var newResult = {}
    newResult.rows = rows
    newAnswer.result = newResult
    accumAnswer.push(newAnswer)
    runQueries(id, spark, db, queryArray, accumAnswer)
  })
}

export default class SQLiteServer {
  constructor() {
    console.log('making server')
    Primus.createServer(spark => onConnection({ forceMemory: false }, spark), {
      port: 8082,
      transformer: 'websockets',
      iknowhttpsisbetter: true,
    })
  }
}
