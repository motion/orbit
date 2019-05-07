import PrettyError from 'pretty-error'

import { prepareStackTrace } from './prepare-stack-trace'

export function getErrorFormatter() {
  const prettyError = new PrettyError()
  const baseRender = prettyError.render

  prettyError.skipNodeFiles()
  prettyError.skipPackage(
    `regenerator-runtime`,
    `graphql`,
    `core-js`,
    // `static-site-generator-webpack-plugin`,
    // `tapable`, // webpack
  )

  // @ts-ignore
  prettyError.skip(traceLine => {
    if (traceLine && traceLine.file === `asyncToGenerator.js`) return true
    return false
  })

  prettyError.appendStyle({
    'pretty-error': {
      marginTop: 1,
    },
    'pretty-error > header': {
      background: `red`,
    },
    'pretty-error > header > colon': {
      color: `white`,
    },
  })

  if (process.env.FORCE_COLOR === `0`) {
    prettyError.withoutColors()
  }

  prettyError.render = err => {
    if (Array.isArray(err)) {
      return err.map(x => prettyError.render(x)).join(`\n`)
    }

    let rendered = baseRender.call(prettyError, err)
    if (err && err['codeFrame']) rendered = `\n${err['codeFrame']}\n${rendered}`
    return rendered
  }
  return prettyError
}

/**
 * Convert a stringified webpack compilation error back into
 * an Error instance so it can be formatted properly
 * @param {string} errorStr
 */
export function createErrorFromString(errorStr: string = ``, sourceMapFile: string) {
  let [message, ...rest] = errorStr.split(/\r\n|[\n\r]/g)
  // pull the message from the first line then remove the `Error:` prefix
  // FIXME: when https://github.com/AriaMinaei/pretty-error/pull/49 is merged

  message = message.replace(/^(Error:)/, ``)

  let error = new Error(message)

  error.stack = [message, rest.join(`\n`)].join(`\n`)

  error.name = `WebpackError`
  try {
    if (sourceMapFile) prepareStackTrace(error, sourceMapFile)
  } catch (err) {
    // don't shadow a real error because of a parsing issue
  }
  return error
}
