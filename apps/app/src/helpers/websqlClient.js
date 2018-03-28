var PrimusAdaptor,
  SQLiteFactory,
  SQLitePlugin,
  SQLitePluginTransaction,
  argsArray,
  dblocations,
  nextTick,
  txLocks

const READ_ONLY_REGEX = /^\s*(?:drop|delete|insert|update|create)\s/i

txLocks = {}

nextTick =
  window.setImmediate ||
  function(fun) {
    window.setTimeout(fun, 0)
  }

/*
  Utility that avoids leaking the arguments object. See
  https://www.npmjs.org/package/argsarray
 */

argsArray = function(fun) {
  return function() {
    var args, i, len
    len = arguments.length
    if (len) {
      args = []
      i = -1
      while (++i < len) {
        args[i] = arguments[i]
      }
      return fun.call(this, args)
    } else {
      return fun.call(this, [])
    }
  }
}

SQLitePlugin = function(openargs, openSuccess, openError, primusAdaptor) {
  var dbname
  console.log('SQLitePlugin openargs: ' + JSON.stringify(openargs), openSuccess)
  if (!(openargs && openargs['name'])) {
    throw new Error(
      'Cannot create a SQLitePlugin' + 'instance without a db name',
    )
  }
  dbname = openargs.name
  this.primusAdaptor = primusAdaptor
  this.openargs = openargs
  this.dbname = dbname
  this.openSuccess = openSuccess
  this.openError = openError
  if (!this.openSuccess) {
    this.openSuccess = function() {
      console.log('DB opened: ' + dbname)
    }
  }
  if (!this.openError) {
    this.openError = function(e) {
      console.log(e.message)
    }
  }
  this.open(this.openSuccess, this.openError)
}

SQLitePlugin.prototype.databaseFeatures = {
  isSQLitePluginDatabase: true,
}

SQLitePlugin.prototype.openDBs = {}

SQLitePlugin.prototype.addTransaction = function(t) {
  if (!txLocks[this.dbname]) {
    txLocks[this.dbname] = {
      queue: [],
      inProgress: false,
    }
  }
  txLocks[this.dbname].queue.push(t)
  this.startNextTransaction()
}

SQLitePlugin.prototype.transaction = function(fn, error, success) {
  if (!this.openDBs[this.dbname]) {
    error('database not open')
    return
  }
  this.addTransaction(
    new SQLitePluginTransaction(
      this,
      fn,
      error,
      success,
      true,
      false,
      this.primusAdaptor,
    ),
  )
}

SQLitePlugin.prototype.readTransaction = function(fn, error, success) {
  if (!this.openDBs[this.dbname]) {
    error('database not open')
    return
  }
  this.addTransaction(
    new SQLitePluginTransaction(
      this,
      fn,
      error,
      success,
      true,
      true,
      this.primusAdaptor,
    ),
  )
}

SQLitePlugin.prototype.startNextTransaction = function() {
  var self
  self = this
  nextTick(function() {
    var txLock
    txLock = txLocks[self.dbname]
    if (txLock.queue.length > 0 && !txLock.inProgress) {
      txLock.inProgress = true
      txLock.queue.shift().start()
    }
  })
}

SQLitePlugin.prototype.open = function(success, error) {
  var onSuccess
  onSuccess = (function(_this) {
    return function() {
      return success(_this)
    }
  })(this)
  if (!(this.dbname in this.openDBs)) {
    this.openDBs[this.dbname] = true
    this.primusAdaptor.open(onSuccess, error, [this.openargs])
  } else {
    /*
    for a re-open run onSuccess async so that the openDatabase return value
    can be used in the success handler as an alternative to the handler's
    db argument
     */
    nextTick(function() {
      return onSuccess()
    })
  }
}

SQLitePlugin.prototype.close = function(success, error) {
  if (this.dbname in this.openDBs) {
    if (txLocks[this.dbname] && txLocks[this.dbname].inProgress) {
      error(
        new Error(
          'database cannot be closed ' + 'while a transaction is in progress',
        ),
      )
      return
    }
    delete this.openDBs[this.dbname]
    this.primusAdaptor.close(success, error, [
      {
        path: this.dbname,
      },
    ])
  }
}

SQLitePlugin.prototype.executeSql = function(
  statement,
  params,
  success,
  error,
) {
  var myerror, myfn, mysuccess
  mysuccess = function(t, r) {
    if (success) {
      return success(r)
    }
  }
  myerror = function(t, e) {
    if (error) {
      return error(e)
    }
  }
  myfn = function(tx) {
    tx.executeSql(statement, params, mysuccess, myerror)
  }
  this.addTransaction(
    new SQLitePluginTransaction(
      this,
      myfn,
      null,
      null,
      false,
      false,
      this.primusAdaptor,
    ),
  )
}

/*
Transaction batching object:
 */

SQLitePluginTransaction = function(
  db,
  fn,
  error,
  success,
  txlock,
  readOnly,
  primusAdaptor,
) {
  if (typeof fn !== 'function') {
    /*
    This is consistent with the implementation in Chrome -- it
    throws if you pass anything other than a function. This also
    prevents us from stalling our txQueue if somebody passes a
    false value for fn.
     */
    throw new Error('transaction expected a function')
  }
  this.primusAdaptor = primusAdaptor
  this.db = db
  this.fn = fn
  this.error = error
  this.success = success
  this.txlock = txlock
  this.readOnly = readOnly
  this.executes = []
  if (txlock) {
    this.executeSql('BEGIN', [], null, function(tx, err) {
      throw new Error('unable to begin transaction: ' + err.message)
    })
  }
}

SQLitePluginTransaction.prototype.start = function() {
  var err
  try {
    this.fn(this)
    this.run()
  } catch (_error) {
    err = _error

    /*
    If "fn" throws, we must report the whole transaction as failed.
     */
    txLocks[this.db.dbname].inProgress = false
    this.db.startNextTransaction()
    if (this.error) {
      this.error(err)
    }
  }
}

SQLitePluginTransaction.prototype.executeSql = function(
  sql,
  values,
  success,
  error,
) {
  var qid
  if (this.readOnly && READ_ONLY_REGEX.test(sql)) {
    this.handleStatementFailure(error, {
      message: 'invalid sql for a read-only transaction',
    })
    return
  }
  qid = this.executes.length
  this.executes.push({
    success: success,
    error: error,
    qid: qid,
    sql: sql,
    params: values || [],
  })
}

SQLitePluginTransaction.prototype.handleStatementSuccess = function(
  handler,
  response,
) {
  var payload, rows
  if (!handler) {
    return
  }
  rows = response.rows || []
  payload = {
    rows: {
      item: function(i) {
        return rows[i]
      },
      length: rows.length,
    },
    rowsAffected: response.rowsAffected || 0,
    insertId: response.insertId || void 0,
  }
  handler(this, payload)
}

SQLitePluginTransaction.prototype.handleStatementFailure = function(
  handler,
  response,
) {
  if (!handler) {
    throw new Error(
      'a statement with no error handler failed: ' + response.message,
    )
  }
  if (handler(this, response)) {
    throw new Error('a statement error callback did not return false')
  }
}

SQLitePluginTransaction.prototype.run = function() {
  var batchExecutes,
    errcb,
    handlerFor,
    i,
    mycb,
    mycbmap,
    qid,
    request,
    tropts,
    tx,
    txFailure,
    waiting
  txFailure = null
  tropts = []
  batchExecutes = this.executes
  waiting = batchExecutes.length
  this.executes = []
  tx = this
  handlerFor = function(index, didSucceed) {
    return function(response) {
      var err
      try {
        if (didSucceed) {
          tx.handleStatementSuccess(batchExecutes[index].success, response)
        } else {
          tx.handleStatementFailure(batchExecutes[index].error, response)
        }
      } catch (_error) {
        err = _error
        if (!txFailure) {
          txFailure = err
        }
      }
      if (--waiting === 0) {
        if (txFailure) {
          tx.abort(txFailure)
        } else if (tx.executes.length > 0) {
          /*
          new requests have been issued by the callback
          handlers, so run another batch.
           */
          tx.run()
        } else {
          tx.finish()
        }
      }
    }
  }
  i = 0
  mycbmap = {}
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
  mycb = function(result) {
    var j, len1, q, r, res, type
    for (j = 0, len1 = result.length; j < len1; j++) {
      r = result[j]
      type = r.type
      qid = r.qid
      res = r.result
      q = mycbmap[qid]
      if (q) {
        if (q[type]) {
          q[type](res)
        }
      }
    }
  }
  errcb = (function(_this) {
    return function(err) {
      _this.error = function(err) {
        return console.warn(err)
      }
      return _this.abort(new Error(err))
    }
  })(this)
  this.primusAdaptor.backgroundExecuteSqlBatch(mycb, errcb, [
    {
      dbargs: {
        dbname: this.db.dbname,
      },
      executes: tropts,
    },
  ])
}

SQLitePluginTransaction.prototype.abort = function(txFailure) {
  var failed, succeeded, tx
  if (this.finalized) {
    return
  }
  tx = this
  succeeded = function(tx) {
    txLocks[tx.db.dbname].inProgress = false
    tx.db.startNextTransaction()
    if (tx.error) {
      tx.error(txFailure)
    }
  }
  failed = function(tx, err) {
    txLocks[tx.db.dbname].inProgress = false
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
    succeeded(tx)
  }
}

SQLitePluginTransaction.prototype.finish = function() {
  var failed, succeeded, tx
  if (this.finalized) {
    return
  }
  tx = this
  succeeded = function(tx) {
    txLocks[tx.db.dbname].inProgress = false
    tx.db.startNextTransaction()
    if (tx.success) {
      tx.success()
    }
  }
  failed = function(tx, err) {
    txLocks[tx.db.dbname].inProgress = false
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
    succeeded(tx)
  }
}

PrimusAdaptor = (function() {
  function PrimusAdaptor() {
    var self
    this.primus = new window.Primus('http://localhost:8082', {
      websockets: true,
    })
    this.id = 0
    this.cblist = []
    self = this
    this.primus.on('data', function(data) {
      return self.onData(data)
    })
  }

  PrimusAdaptor.prototype.onData = function(data) {
    // console.log('primus gettin data', data, this.cblist, data.id)
    const callback = this.cblist[data.id]
    delete this.cblist[data.id]
    switch (data.command) {
      case 'openComplete':
        if (data.err) {
          callback.e(data.err, data.databaseID)
        } else {
          callback.s(data.err, data.databaseID)
        }
        return
      case 'backgroundExecuteSqlBatchFailed':
        return callback.e(data.err, data.databaseID)
      case 'backgroundExecuteSqlBatchComplete':
        return callback.s(data.answer)
    }
  }

  PrimusAdaptor.prototype.open = function(onSuccess, onError, args) {
    this.cblist[this.id] = {
      s: onSuccess,
      e: onError,
    }
    return this.primus.write({
      command: 'open',
      args: args,
      id: this.id++,
    })
  }

  PrimusAdaptor.prototype.close = function(onSuccess, onError, args) {
    this.cblist[this.id] = {
      s: onSuccess,
      e: onError,
    }
    return this.primus.write({
      command: 'close',
      path: args[0].path,
      args: args,
      id: this.id++,
    })
  }

  PrimusAdaptor.prototype['delete'] = function(onSuccess, onError, args) {
    this.cblist[this.id] = {
      s: onSuccess,
      e: onError,
    }
    return this.primus.write({
      command: 'delete',
      args: args,
      id: this.id++,
    })
  }

  PrimusAdaptor.prototype.backgroundExecuteSqlBatch = function(
    onSuccess,
    onError,
    args,
  ) {
    this.cblist[this.id] = {
      s: onSuccess,
      e: onError,
    }
    return this.primus.write({
      command: 'backgroundExecuteSqlBatch',
      args: args,
      id: this.id++,
    })
  }

  return PrimusAdaptor
})()

dblocations = ['docs', 'libs', 'nosync']

SQLiteFactory = {
  primusAdaptor: null,

  /*
  NOTE: this function should NOT be translated from Javascript
  back to CoffeeScript by js2coffee.
  If this function is edited in Javascript then someone will
  have to translate it back to CoffeeScript by hand.
   */
  opendb: argsArray(function(args) {
    var dblocation, errorcb, first, okcb, openargs, primusAdaptor
    if (args.length < 1) {
      return null
    }
    if (!primusAdaptor) {
      primusAdaptor = new PrimusAdaptor()
    }
    first = args[0]
    openargs = null
    okcb = null
    errorcb = null
    if (first.constructor === String) {
      openargs = {
        name: first,
      }
      if (args.length >= 5) {
        okcb = args[4]
        if (args.length > 5) {
          errorcb = args[5]
        }
      }
    } else {
      openargs = first
      if (args.length >= 2) {
        okcb = args[1]
        if (args.length > 2) {
          errorcb = args[2]
        }
      }
    }
    if (openargs.location) {
      dblocation = dblocations[openargs.location]
    }
    openargs.dblocation = dblocation || dblocations[0]
    if (!!openargs.createFromLocation && openargs.createFromLocation === 1) {
      openargs.createFromResource = '1'
    }
    return new SQLitePlugin(openargs, okcb, errorcb, primusAdaptor)
  }),
  deleteDb: function(first, success, error) {
    var args, dblocation
    args = {}
    if (first.constructor === String) {
      args.path = first
      args.dblocation = dblocations[0]
    } else {
      if (!(first && first['name'])) {
        throw new Error('Please specify db name')
      }
      args.path = first.name
      if (first.location) {
        dblocation = dblocations[first.location]
      }
      args.dblocation = dblocation || dblocations[0]
    }
    delete SQLitePlugin.prototype.openDBs[args.path]
    return this.primusAdaptor['delete'](success, error, [args])
  },
}

window.sqlitePlugin = {
  sqliteFeatures: {
    isSQLitePlugin: true,
  },
  openDatabase: SQLiteFactory.opendb,
  deleteDatabase: SQLiteFactory.deleteDb,
}
