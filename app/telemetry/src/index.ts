import { flush } from './flush'
import { Telemetry } from './telemetry'

const instance = new Telemetry()

process.on(`exit`, flush)

// For longrunning commands we want to occasinally flush the data
// The data is also sent on exit.
const interval = 10 * 60 * 1000 // 10 min

const tick = _ => {
  flush()
    .catch(console.error)
    .then(_ => setTimeout(tick, interval))
}

export const trackCli = (input, tags?) => instance.captureEvent(input, tags)
export const trackError = (input, tags?) => instance.captureError(input, tags)
export const trackBuildError = (input, tags?) => instance.captureBuildError(input, tags)
export const setDefaultTags = tags => instance.decorateAll(tags)
export const decorateEvent = (event, tags?) => instance.decorateNextEvent(event, tags)
export const setTelemetryEnabled = enabled => instance.setTelemetryEnabled(enabled)

export const startBackgroundUpdate = _ => {
  setTimeout(tick, interval)
}

export const expressMiddleware = source => (_req, _res, next) => {
  try {
    instance.trackActivity(`${source}_ACTIVE`)
  } catch (e) {
    // ignore
  }
  next()
}
