import Primus from 'primus'
import recoverDB from '~/helpers/recoverDB'

export default class SQLiteServer {
  id = 1
  txLock = null
  queue = []
  db = null

  constructor({ db }) {
    this.db = db
    Primus.createServer(
      spark => this.onConnection({ forceMemory: false }, spark),
      {
        port: 8082,
        transformer: 'websockets',
        iknowhttpsisbetter: true,
      },
    )
  }

  onConnection(options, spark) {
    let uid = ++this.id
    spark.on('data', data => {
      if (this.txLock && this.txLock !== uid) {
        this.queue.push([options, spark, data, uid])
        return
      }
      this.onData(options, spark, data, uid)
    })
  }

  finishLock() {
    this.txLock = null
    const running = [...this.queue]
    this.queue = []
    for (const [a, b, c, d] of running) {
      this.onData(a, b, c, d)
    }
  }

  onData = async (_, spark, data, uid) => {
    switch (data.command) {
      case 'backgroundExecuteSqlBatch':
        const queries = data.args[0].executes
        const sql = `${queries[0].sql}`
        if (sql === 'BEGIN TRANSACTION') {
          this.txLock = uid
        }
        await this.runQueries(data.id, spark, this.db, queries, [])
        if (sql === 'COMMIT') {
          this.finishLock()
        }
    }
  }

  async runQueries(id, spark, db, queryArray, accumAnswer) {
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
      await this.runQueries(id, spark, db, queryArray, accumAnswer)
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
}
