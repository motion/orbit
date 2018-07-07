const READ_ONLY_REGEX = /^\s*(?:drop|delete|insert|update|create)\s/i

export class SQLitePluginTransaction {
  txLocks
  db
  fn
  error
  success
  txlock
  errorCb: Function
  readOnly: boolean
  finalized = false
  executes = []
  primusAdaptor

  constructor(
    db,
    fn,
    error,
    success,
    txlock,
    readOnly,
    primusAdaptor,
    txLocks,
    errorCb,
  ) {
    if (typeof fn !== 'function') {
      // This is consistent with the implementation in Chrome -- it
      // throws if you pass anything other than a function. This also
      // prevents us from stalling our txQueue if somebody passes a
      // false value for fn.
      throw new Error('transaction expected a function')
    }
    this.errorCb = errorCb
    this.txLocks = txLocks
    this.primusAdaptor = primusAdaptor
    this.db = db
    this.fn = fn
    this.error = error
    this.success = success
    this.txlock = txlock
    this.readOnly = readOnly
    if (txlock) {
      this.executeSql('BEGIN', [], null, function(tx, err) {
        throw new Error('unable to begin transaction: ' + err.message)
      })
    }
  }

  start() {
    try {
      this.fn(this)
      this.run()
    } catch (err) {
      // If "fn" throws, we must report the whole transaction as failed.
      this.txLocks[this.db.dbname].inProgress = false
      this.db.startNextTransaction()
      if (this.error) {
        this.error(err)
      }
    }
  }

  executeSql(sql, values, success, error) {
    if (this.readOnly && READ_ONLY_REGEX.test(sql)) {
      this.handleStatementFailure(error, {
        message: 'invalid sql for a read-only transaction',
      })
      return
    }
    this.executes.push({
      success: success,
      error: error,
      qid: this.executes.length,
      sql: sql,
      params: values || [],
    })
  }

  handleStatementSuccess(handler, response) {
    if (!handler) {
      return
    }
    const rows = response.rows || []
    handler(this, {
      rows: {
        item: function(i) {
          return rows[i]
        },
        length: rows.length,
      },
      rowsAffected: response.rowsAffected || 0,
      insertId: response.insertId || void 0,
    })
  }

  handleStatementFailure(handler, response) {
    if (!handler) {
      throw new Error(
        'a statement with no error handler failed: ' + response.message,
      )
    }
    if (handler(this, response)) {
      throw new Error('a statement error callback did not return false')
    }
  }

  run() {
    let qid = -1
    const batchExecutes = this.executes
    let txFailure = null
    let waiting = batchExecutes.length
    const tropts = []
    this.executes = []

    const handlerFor = (index, didSucceed) => {
      return function(response) {
        try {
          if (didSucceed) {
            this.handleStatementSuccess(batchExecutes[index].success, response)
          } else {
            this.handleStatementFailure(batchExecutes[index].error, response)
          }
        } catch (err) {
          if (!txFailure) {
            txFailure = err
          }
        }
        if (--waiting === 0) {
          if (txFailure) {
            this.abort(txFailure)
          } else if (this.executes.length > 0) {
            // new requests have been issued by the callback
            // handlers, so run another batch.
            this.run()
          } else {
            this.finish()
          }
        }
      }
    }

    let i = 0
    const mycbmap = {}
    let request
    while (i < batchExecutes.length) {
      request = batchExecutes[i]
      qid = request.qid
      mycbmap[qid] = {
        success: handlerFor(i, true),
        error: handlerFor(i, false),
      }
      tropts.push({
        qid: qid,
        sql: request.sql,
        params: request.params,
      })
      i++
    }

    function mycb(result) {
      let j = 0
      let len1 = result.length
      for (; j < len1; j++) {
        const r = result[j]
        const type = r.type
        const qid = r.qid
        const res = r.result
        const q = mycbmap[qid]
        if (q) {
          if (q[type]) {
            q[type](res)
          }
        }
      }
    }

    const errcb = () => {
      return err => {
        this.error = function(err) {
          if (this.errorCb) {
            this.errorCb(err)
          }
          console.warn(err)
        }
        return this.abort(new Error(err))
      }
    }

    this.primusAdaptor.backgroundExecuteSqlBatch(mycb, errcb, [
      {
        dbargs: {
          dbname: this.db.dbname,
        },
        executes: tropts,
      },
    ])
  }

  abort(txFailure) {
    if (this.finalized) {
      return
    }
    const succeeded = tx => {
      this.txLocks[tx.db.dbname].inProgress = false
      tx.db.startNextTransaction()
      if (tx.error) {
        tx.error(txFailure)
      }
    }
    const failed = (tx, err) => {
      this.txLocks[tx.db.dbname].inProgress = false
      tx.db.startNextTransaction()
      if (tx.error) {
        tx.error(new Error('error while trying to roll back: ' + err.message))
      }
    }
    this.finalized = true
    if (this.txlock) {
      this.executeSql('ROLLBACK', [], succeeded, failed)
      this.run()
    } else {
      succeeded(this)
    }
  }

  finish() {
    if (this.finalized) {
      return
    }
    const succeeded = tx => {
      this.txLocks[tx.db.dbname].inProgress = false
      tx.db.startNextTransaction()
      if (tx.success) {
        tx.success()
      }
    }
    const failed = (tx, err) => {
      this.txLocks[tx.db.dbname].inProgress = false
      tx.db.startNextTransaction()
      if (tx.error) {
        tx.error(new Error('error while trying to commit: ' + err.message))
      }
    }
    this.finalized = true
    if (this.txlock) {
      this.executeSql('COMMIT', [], succeeded, failed)
      this.run()
    } else {
      succeeded(this)
    }
  }
}
