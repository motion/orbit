const path = require('path')
const execa = require('execa')
const electronUtil = require('electron-util/node')

const BIN = path.join(
  electronUtil.fixPathForAsarUnpack(__dirname),
  'Swindler',
  'run',
)

class Swindler {
  constructor() {
    const stop = () => this.stop()
    process.on('exit', stop)
    process.on('SIGINT', stop)
    process.on('SIGUSR1', stop)
    process.on('SIGUSR2', stop)
  }

  start() {
    if (this.app !== undefined) {
      throw new Error('Call `.stop()` first')
    }
    this.app = execa(BIN, [], {
      reject: false,
    })
    this.app.catch((err, ...rest) => {
      console.log('Swindler err:', ...rest)
      console.log(err)
      console.log(err.stack)
      throw err
    })
    this.app.stderr.setEncoding('utf8')
    this.app.stderr.on('data', data => {
      if (data && this.changeCB) {
        this.changeCB(data.trim())
      }
    })
    return this.app
  }

  onChange(cb) {
    this.changeCB = cb
  }

  async stop() {
    if (this.app === undefined) {
      // null if not recording
      return
    }
    this.app.stderr.removeAllListeners()
    this.app.kill()
    this.app.kill('SIGKILL')
    await this.app
    delete this.app
  }
}

module.exports = Swindler
