export class PrimusAdaptor {
  primus: any
  id = 0
  cblist = []

  constructor() {
    this.connect()
  }

  private connect() {
    // @ts-ignore
    this.primus = new window.Primus('http://localhost:8082', {
      websockets: true,
    })
    this.primus.on('data', data => {
      return this.onData(data)
    })
    this.primus.on('error', err => {
      console.log('got an error', err.message, err.stack)
      this.primus.end()
    })
    this.primus.on('close', () => {
      console.log(
        'promise was closed, may need to reconnect?',
        this.primus,
        PrimusAdaptor,
      )
      // this.primus.end()
    })
  }

  onData = data => {
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

  open = (onSuccess, onError, args) => {
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

  close = (onSuccess, onError, args) => {
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

  delete = (onSuccess, onError, args) => {
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

  backgroundExecuteSqlBatch = (onSuccess, onError, args) => {
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
}
