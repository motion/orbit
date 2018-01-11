const path = require('path')
const execa = require('execa')
const electronUtil = require('electron-util/node')

const BIN = path.join(
  electronUtil.fixPathForAsarUnpack(__dirname),
  'swindler-cli',
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
    this.app.stdout.setEncoding('utf8')
    this.app.stdout.on('data', data => {
      if (this.changeCB) {
        const out = data.trim()
        this.changeCB(out)
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
    this.app.stdout.removeAllListeners()
    this.app.kill()
    this.app.kill('SIGKILL')
    await this.app
    delete this.app
  }
}

module.exports = Swindler
