import { SQLitePlugin } from './SQLitePlugin'

// temproray to debug locks
window.lastQueryQueue = []

export class WebSQLClient {
  nextTick = setImmediate
  txLocks = {}

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
}
