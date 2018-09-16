// allows nice logs in both terminal and inspector
// see: https://github.com/visionmedia/debug/issues/483

export function hookConsole(inspectFormatter, nodeFormatter, level = 'log') {
  // for browser environment we can just use inspectorFormatter
  if (typeof window !== 'undefined') {
    return (...args) => console[level](...inspectFormatter(...args))
  }

  // Back up the current console configuration for
  // failing back in the event of an error
  const defaultConsole = console
  const defaultStdout = console['_stdout']
  const defaultStderr = console['_stderr']

  try {
    // Pull in the config binding, which exposes internal
    // configuration - namely the inspectorEnabled flag,
    // which is true if either `--inspect` or `--inspect-brk`
    // were passed.
    // https://github.com/nodejs/node/blob/5e7c69716ecbb7a0ebceaed7cc1c6847f9bc5058/src/node_config.cc#L114-L116
    // @ts-ignore
    const configBinding = process.binding('config')
    if (!configBinding.debugOptions.inspectorEnabled) {
      return console[level]
    }

    const inspectorConsole = global.console

    // Create a new console object using the configured stdout and stderr streams.
    // If no errors occur, this is what the global `console` object becomes.
    //
    // This is because the console object has been wrapped in inspector mode
    // to output to both the Console object's configured stdout/stderr
    // as well as the web inspector. There is no other (known) way
    // to get a handle to a stream for the web inspector's output,
    // so instead we hijack the one the current inspector instance provides and
    // 'mute' it from outputting to stdout/stderr. This gives us an effectively
    // exclusive interface to the web inspector session.
    const vanillaConsole = new (require('console')).Console(console['_stdout'], console['_stderr'])

    // Try to remove the global console object.
    // Simply re-assigning does not work as I don't think
    // the descriptor allows for overwriting, but _does_
    // allow deletion.
    if (!delete global.console) {
      return console[level]
    }

    // Replace the global console with the new vanilla console.
    global.console = vanillaConsole

    // Create the black hole stream
    const nullStream = new (require('stream')).Writable()
    nullStream._write = () => {}

    // Mute the wrapped Console object's stdout/stderr (see above comment)
    inspectorConsole['_stdout'] = nullStream
    inspectorConsole['_stderr'] = nullStream

    // Create a wrapper to format/output to the node console
    const nodeOutput = (...args) => console[level](...nodeFormatter(...args))
    // Create a wrapper to format/output to the web inspector console
    const inspectorOutput = (...args) => inspectorConsole[level](...inspectFormatter(...args))

    // This pulls in the internal inspector binding that exposes the consoleCall function,
    // which will call the first argument (a function) if the web inspector is /connected/
    // and will always call the second function. The empty object is used for what appears
    // to be a semaphore-like function, but we don't need any of that so an empty object is fine.
    //
    // https://github.com/nodejs/node/blob/60f2fa9a8b050563d2b7f3642a84ff192bd362a6/src/inspector_agent.cc#L335-L370
    //
    // The return value is a single function call that will call inspectorOutput() (above) if the inspector
    // is connected and has an active session, and then it'll call nodeOutput() after, and will forward
    // all of the arguments to those functions.
    // @ts-ignore
    const inspectorBinding = process.binding('inspector')
    return inspectorBinding.consoleCall.bind(inspectorConsole, nodeOutput, inspectorOutput, {})
  } catch (err) {
    // Try to restore the original console (should always work but this protects against
    // strange configurations of the console descriptor).
    try {
      delete global.console
    } catch (err) {}
    global.console = defaultConsole
    global.console['_stdout'] = defaultStdout
    global.console['_stderr'] = defaultStderr
    return console[level]
  }
}

export const formatInspector = colorize => (...args) => {
  const [namespace, ...rest] = args
  return [].concat(colorize(namespace), ...rest)
}

export const formatNodeConsole = colorize => (...args) => {
  const [namespace, ...rest] = args
  return `${colorize(namespace)}${rest.join(' ')}`
}
