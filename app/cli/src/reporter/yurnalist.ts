import convertHrtime from 'convert-hrtime'
import { createReporter } from 'yurnalist'

// todo this isnt picking up verbose...
let reporter = createReporter({ emoji: true, verbose: false })

/**
 * Reporter module.
 * @module reporter
 */
export default {
  /**
   * Toggle verbosity.
   * @param {boolean} [isVerbose=true]
   */
  setVerbose(isVerbose = true) {
    reporter.isVerbose = !!isVerbose
  },
  /**
   * Turn off colors in error output.
   */
  setColors(_?) {},

  success: reporter.success.bind(reporter),
  error: reporter.error.bind(reporter),
  verbose: reporter.verbose.bind(reporter),
  info: reporter.info.bind(reporter),
  warn: reporter.warn.bind(reporter),
  log: reporter.log.bind(reporter),
  /**
   * Time an activity.
   * @param {string} name - Name of activity.
   * @returns {string} The elapsed time of activity.
   */
  createActivity(name) {
    const spinner = reporter.activity()
    const start = process.hrtime()
    let status

    const elapsedTime = () => {
      var elapsed = process.hrtime(start)
      return `${convertHrtime(elapsed)[`seconds`].toFixed(3)} s`
    }

    return {
      start: () => {
        spinner.tick(name)
      },
      setStatus: s => {
        status = s
        spinner.tick(`${name} — ${status}`)
      },
      end: () => {
        const str = status ? `${name} — ${elapsedTime()} — ${status}` : `${name} — ${elapsedTime()}`
        reporter.success(str)
        spinner.end()
      },
    }
  },
}
