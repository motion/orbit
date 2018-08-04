import { SQLitePluginTransaction } from './SQLitePluginTransaction'
import { PrimusAdaptor } from './PrimusAdaptor'

export class SQLitePlugin {
  lastQueryQueue = []
  txLocks: Object
  nextTick = setImmediate
  dbname: string
  openSuccess = () => {
    console.log('DB opened: ' + this.dbname)
  }
  openError = e => {
    console.log('openError', e.message)
  }
  primusAdaptor: PrimusAdaptor
  errorCb = null
  openargs = null
  openDBs = {}
  databaseFeatures = {
    isSQLitePluginDatabase: true,
  }

  constructor(
    txLocks,
    openargs,
    openSuccess,
    openError,
    primusAdaptor,
    errorCb,
  ) {
    if (!(openargs && openargs.name)) {
      throw new Error('Cannot create a SQLitePlugin instance without a db name')
    }
    const dbname = openargs.name
    this.errorCb = errorCb
    this.txLocks = txLocks
    this.primusAdaptor = primusAdaptor
    this.openargs = openargs
    this.dbname = dbname
    this.openSuccess = openSuccess
    this.openError = openError
    this.open(this.openSuccess, this.openError)
  }

  addTransaction = transaction => {
    if (!this.txLocks[this.dbname]) {
      this.txLocks[this.dbname] = {
        queue: [],
        inProgress: false,
      }
    }
    this.txLocks[this.dbname].queue.push(transaction)
    this.startNextTransaction()
  }

  transaction = (fn, error, success) => {
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
        this.txLocks,
        this.errorCb,
      ),
    )
  }

  readTransaction = (fn, error, success) => {
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
        this.txLocks,
        this.errorCb,
      ),
    )
  }

  startNextTransaction = () => {
    this.nextTick(() => {
      const txLock = this.txLocks[this.dbname]
      if (txLock.queue.length > 0 && !txLock.inProgress) {
        txLock.inProgress = true
        txLock.queue.shift().start()
      }
    })
  }

  open = (success, error) => {
    const onSuccess = () => success(this)
    if (!(this.dbname in this.openDBs)) {
      this.openDBs[this.dbname] = true
      this.primusAdaptor.open(onSuccess, error, [this.openargs])
    } else {
      // for a re-open run onSuccess async so that the openDatabase return value
      // can be used in the success handler as an alternative to the handler's
      // db argument
      this.nextTick(onSuccess)
    }
  }

  close = (success, error) => {
    if (this.dbname in this.openDBs) {
      if (this.txLocks[this.dbname] && this.txLocks[this.dbname].inProgress) {
        error(
          new Error(
            'database cannot be closed while a transaction is in progress',
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

  executeSql = (statement, params, success, error) => {
    const mysuccess = (_, r) => {
      if (success) {
        return success(r)
      }
    }
    const myerror = (_, e) => {
      if (error) {
        return error(e)
      }
    }
    const execute = tx => {
      this.lastQueryQueue.push([statement, params])
      tx.executeSql(statement, params, mysuccess, myerror)
    }
    this.addTransaction(
      new SQLitePluginTransaction(
        this,
        execute,
        null,
        null,
        false,
        false,
        this.primusAdaptor,
        this.txLocks,
        this.errorCb,
      ),
    )
  }
}
