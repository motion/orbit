import usage from 'usage'

const { pid } = process

// stupid but useful
const SECONDS_BETWEEN_MEMORY_LOG = 30
// seconds before start monitoring
const STARTUP_WAIT = 1000 * 10
// this option will give us cpu usage since last check, each time
const options = { keepHistory: true }

let burnTime = 0

// every second
setTimeout(() => {
  setInterval(() => {
    usage.lookup(pid, options, (err, res) => {
      if (err || !res) {
        console.log(err)
        return
      }
      // in percent
      if (res.cpu > 90) {
        console.log(`CPU usage above 90% for ${burnTime} seconds`)
        burnTime++
      } else {
        burnTime = 0
      }

      if (burnTime > 60) {
        console.log('weve been burning far too long')
        process.exit()
      }
    })
  }, 1000)
}, STARTUP_WAIT)

setInterval(() => {
  usage.lookup(pid, options, (err, res) => {
    console.log('memory usage:', res.memory / 1024 / 1024, 'gb')
  })
}, SECONDS_BETWEEN_MEMORY_LOG * 1000)
