const cp = require('child_process')
const path = require('path')
// const execa = require('execa')
const electronUtil = require('electron-util/node')

const BIN = path.join(
  electronUtil.fixPathForAsarUnpack(__dirname),
  'Swindler',
  'run',
)

const child = cp.exec(BIN)
child.stdout.on('data', data => {
  console.log(data)
})
child.stderr.on('data', data => {
  console.log(data)
})
child.on('close', code => {
  console.log('close')
  console.log(code)
})

// class Swindler {
//   constructor() {
//     const stop = () => this.stop()
//     process.on('exit', stop)
//     process.on('SIGINT', stop)
//     process.on('SIGUSR1', stop)
//     process.on('SIGUSR2', stop)
//   }

//   start() {
//     if (this.app !== undefined) {
//       throw new Error('Call `.stop()` first')
//     }
//     this.app = execa(BIN, [], {
//       reject: false,
//     })
//     this.app.catch((err, ...rest) => {
//       console.log('Swindler err:', ...rest)
//       console.log(err)
//       console.log(err.stack)
//       throw err
//     })
//     this.app.stdout.setEncoding('utf8')
//     this.app.stdout.on('data', data => {
//       console.log('data.trim()', console.log('data.trim()'))
//       if (this.changeCB) {
//         this.changeCB(data.trim())
//       }
//     })
//     return this.app
//   }

//   onChange(cb) {
//     this.changeCB = cb
//   }

//   async stop() {
//     if (this.app === undefined) {
//       // null if not recording
//       return
//     }
//     this.app.stdout.removeAllListeners()
//     this.app.kill()
//     this.app.kill('SIGKILL')
//     await this.app
//     delete this.app
//   }
// }

// module.exports = Swindler
