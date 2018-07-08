import Primus from 'primus'
import recoverDB from '~/helpers/recoverDB'
import { Desktop } from '@mcro/stores'

export default class SQLiteServer {
  id = 0
  txLock = null
  queue = []
  db = null

  constructor({ db }) {
    this.db = db
    Primus.createServer(this.onConnection, {
      port: 8082,
      transformer: 'websockets',
      iknowhttpsisbetter: true,
    })
  }

  onConnection = spark => {
    let uid = ++this.id
    spark.on('data', data => {
      if (this.txLock && this.txLock !== uid) {
        this.queue.push([spark, data, uid])
        return
      }
      this.onData(spark, data, uid)
    })
  }

  async finishLock() {
    this.txLock = null
    const running = [...this.queue]
    this.queue = []
    for (const [a, b, c] of running) {
      await this.onData(a, b, c)
    }
  }

  onData = async (spark, data, uid) => {
    switch (data.command) {
      case 'open':
        spark.write({
          err: null,
          command: 'openComplete',
          id: data.id,
          databaseID: 100,
        })
        break
      case 'backgroundExecuteSqlBatch':
        const queries = data.args[0].executes
        const sql = `${queries[0].sql}`
        if (sql === 'BEGIN TRANSACTION') {
          this.txLock = uid
        }
        await this.runQueries(data.id, spark, queries, [])
        if (sql === 'COMMIT') {
          await this.finishLock()
        }
        break
    }
  }

  async runQueries(id, spark, queryArray, accumAnswer) {
    if (queryArray.length < 1) {
      spark.write({
        command: 'backgroundExecuteSqlBatchComplete',
        err: null,
        answer: accumAnswer,
        id,
      })
      return
    }
    var top = queryArray.shift()
    try {
      // console.log('sql', top.sql, top.params)
      const rows = await this.db.all(top.sql, top.params)
      accumAnswer.push({
        type: 'success',
        qid: top.qid,
        result: { rows },
      })
      await this.runQueries(id, spark, queryArray, accumAnswer)
    } catch (err) {
      console.error('sqlite server err')
      Desktop.setState({
        lastSQLError: Date.now(),
      })
      console.log(err)
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
        id,
      })
    }
  }
}
