const path = require('path')
const execa = require('execa')
const electronUtil = require('electron-util/node')

const BIN = path.join(
  electronUtil.fixPathForAsarUnpack(__dirname),
  'Swindler',
  'Build',
  'Products',
  'Release',
  'SwindlerExample.app',
  'Contents',
  'MacOS',
  'SwindlerExample',
)

class Swindler {
  constructor() {
    // const stop = () => this.stop()
    // process.on('exit', stop)
    // process.on('SIGINT', stop)
    // process.on('SIGUSR1', stop)
    // process.on('SIGUSR2', stop)
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
        const out = data.trim()
        if (!out) {
          return
        }
        if (out[0] === ':') {
          let [event, ...message] = out.slice(1).split(' ')
          message = message.join(' ').trim()
          // convert swift strings
          if (message[0] === '\'') {
            message = `"${message.slice(1, message.length - 1)}"`
          }
          // convert swift tuples
          if (message[0] === '(') {
            message = message
              .slice(1, message.length - 1)
              .split(',')
              .map(x => +x)
          }
          // convert json
          if (message[0] === '"' || message[0] === '{') {
            try {
              message = JSON.parse(message)
            } catch (err) {
              console.log('Swindler: error parsing json', message)
            }
          }
          this.changeCB({
            event,
            message,
          })
        }
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
