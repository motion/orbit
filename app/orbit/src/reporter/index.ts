import { trackError } from '@o/telemetry'
import chalk from 'chalk'
import { stripIndent } from 'common-tags'
import { globalTracer } from 'opentracing'
import util from 'util'

import { getErrorFormatter } from './errors'
import { ActivityArgs, ActivityTracker, Reporter } from './types'
import reporterInstance from './yurnalist'

const tracer = globalTracer()
const errorFormatter = getErrorFormatter()

/**
 * Reporter module.
 * @module reporter
 */
export const reporter: Reporter = {
  /**
   * Strip initial indentation template function.
   */
  stripIndent,
  format: chalk,
  isVerbose: false,

  /**
   * Toggle verbosity.
   * @param {boolean} [isVerbose=true]
   */
  setVerbose: (isVerbose = true) => {
    reporter.isVerbose = isVerbose
    reporterInstance.setVerbose(isVerbose)
  },

  /**
   * Turn off colors in error output.
   * @param {boolean} [isNoColor=false]
   */
  setNoColor(isNoColor = false) {
    reporterInstance.setColors(isNoColor)

    if (isNoColor) {
      errorFormatter.withoutColors()
    }
  },

  /**
   * Log arguments and exit process with status 1.
   * @param {*} args
   */
  panic(message: string, error?: any) {
    // @ts-ignore
    this.error(
      `${message}\n\n If this looks like an Orbit issue, open an issue on https://github.com/motion/orbit/issues`,
      error,
    )
    trackError(`GENERAL_PANIC`, { error })
    console.trace('Exiting after error')
    process.exit(1)
  },

  panicOnBuild(...args) {
    const [message, error] = args
    this.error(message, error)
    trackError(`BUILD_PANIC`, { error: args })
    if (process.env.orbit_executing_command === `build`) {
      process.exit(1)
    }
  },

  error(message: string, error?: any) {
    if (arguments.length === 1 && typeof message !== `string`) {
      error = message
      message = error.message
    }
    reporterInstance.error(message)
    if (error) this.log(errorFormatter.render(error))
  },

  /**
   * Set prefix on uptime.
   * @param {string} prefix - A string to prefix uptime with.
   */
  uptime(prefix) {
    this.verbose(`${prefix}: ${(process.uptime() * 1000).toFixed(3)}ms`)
  },

  success: reporterInstance.success,
  verbose: reporterInstance.verbose,
  info: reporterInstance.info,
  warn: reporterInstance.warn,
  log: reporterInstance.log,

  /**
   * Time an activity.
   * @param {string} name - Name of activity.
   * @param {ActivityArgs} activityArgs - optional object with tracer parentSpan
   * @returns {ActivityTracker} The activity tracker.
   */
  activityTimer(name: string, activityArgs: ActivityArgs = {}): ActivityTracker {
    const { parentSpan } = activityArgs
    const spanArgs = parentSpan ? { childOf: parentSpan } : {}
    const span = tracer.startSpan(name, spanArgs)

    const activity = reporterInstance.createActivity(name)

    return {
      ...activity,
      end() {
        span.finish()
        activity.end()
      },
      span,
    }
  },
}

// @ts-ignore
console.log = (...args) => reporter.log(util.format(...args))
// @ts-ignore
console.warn = (...args) => reporter.warn(util.format(...args))
// @ts-ignore
console.info = (...args) => reporter.info(util.format(...args))
// @ts-ignore
console.error = (...args) => reporter.error(util.format(...args))
