import { SQLitePluginTransaction } from './SQLitePluginTransaction'
import { PrimusAdaptor } from './PrimusAdaptor'

export class SQLitePlugin {
  txLocks: {}
  nextTick = setImmediate
  dbname: string
  openSuccess: Function
  openError: Function
  primusAdaptor: PrimusAdaptor
  dblocations = ['docs', 'libs', 'nosync']
  errorCb = null
  openargs = null
  openDBs = {}
  databaseFeatures = {
    isSQLitePluginDatabase: true,
  }

  constructor(
    txLocks,
    nextTick,
    openargs,
    openSuccess,
    openError,
    primusAdaptor,
  ) {
    if (!(openargs && openargs.name)) {
      throw new Error('Cannot create a SQLitePlugin instance without a db name')
    }
    const dbname = openargs.name
    this.txLocks = txLocks
    this.nextTick = nextTick
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
        console.log('openError', e.message)
      }
    }
    this.open(this.openSuccess, this.openError)
  }

  getPlugin() {
    return {
      opendb: (...args) => {
        let openargs = null
        let okcb = null
        let errorcb = null
        const first = args[0]
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
        let dblocation
        if (openargs.location) {
          dblocation = this.dblocations[openargs.location]
        }
        openargs.dblocation = dblocation || this.dblocations[0]
        if (
          !!openargs.createFromLocation &&
          openargs.createFromLocation === 1
        ) {
          openargs.createFromResource = '1'
        }
        return new SQLitePlugin(
          this.txLocks,
          this.nextTick,
          openargs,
          okcb,
          errorcb,
          this.primusAdaptor,
        )
      },

      deleteDb: (first, success, error) => {
        const args = {
          path: null,
          dblocation: null,
        }
        if (first.constructor === String) {
          args.path = first
          args.dblocation = this.dblocations[0]
        } else {
          if (!(first && first.name)) {
            throw new Error('Please specify db name')
          }
          args.path = first.name
          const dblocation = first.location && this.dblocations[first.location]
          args.dblocation = dblocation || this.dblocations[0]
        }
        delete SQLitePlugin.prototype.openDBs[args.path]
        return this.primusAdaptor['delete'](success, error, [args])
      },
    }
  }

  onError(userErrorCb) {
    this.errorCb = userErrorCb
  }

  addTransaction = t => {
    if (!this.txLocks[this.dbname]) {
      this.txLocks[this.dbname] = {
        queue: [],
        inProgress: false,
      }
    }
    this.txLocks[this.dbname].queue.push(t)
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
    const mysuccess = (t, r) => {
      if (success) {
        return success(r)
      }
    }
    const myerror = (t, e) => {
      if (error) {
        return error(e)
      }
    }
    const myfn = tx => {
      window.lastQueryQueue.push([statement, params])
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
        this.txLocks,
        this.errorCb,
      ),
    )
  }
}
