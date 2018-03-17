import pusage_ from 'pidusage'
import promisify from 'sb-promisify'
const pusage = promisify(pusage_.stat)

let interval

export default async function monitorScreenProcess(
  process,
  onRestart,
  { maxCPU = 90, maxCPUFor = 5, maxMemory = 750 } = {},
) {
  let secondsSpinning = 0
  clearInterval(interval)
  interval = setInterval(async () => {
    if (!process) return
    const children = [process.pid]
    for (const pid of children) {
      try {
        const usage = await pusage(pid)
        const memoryMB = Math.round(usage.memory / 1000 / 1000) // start at byte
        if (memoryMB > maxMemory) {
          console.log('Memory usage of swift above 750MB, restarting')
          onRestart()
        }
        if (usage.cpu > maxCPU) {
          if (secondsSpinning > maxCPUFor / 2) {
            console.log('High cpu usage for', secondsSpinning, 'seconds')
          }
          secondsSpinning += 1
        } else {
          secondsSpinning = 0
        }
        if (secondsSpinning > maxCPUFor) {
          console.log('CPU usage above 90% for 10 seconds, restarting')
          onRestart()
        }
      } catch (err) {
        console.log('error getting process info, restarting', err)
        onRestart()
      }
    }
  }, 1000)
}
