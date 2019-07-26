export type ActivityTracker = {
  start: () => void
  end: () => void
  setStatus: (status: string) => void
  span: Object
}

export type ActivityArgs = {
  parentSpan?: Object
}

type LogMessageType = (format: string, ...args: any[]) => void

export interface Reporter {
  isVerbose: boolean
  stripIndent: Function
  format: Object
  setVerbose(isVerbose: boolean): void
  setNoColor(isNoColor: boolean): void
  panic(...args: any[]): void
  panicOnBuild(...args: any[]): void
  error(message: string, error?: any): void
  uptime(prefix: string): void
  success: LogMessageType
  verbose: LogMessageType
  info: LogMessageType
  warn: LogMessageType
  log: LogMessageType
  activityTimer(name: string, activityArgs: ActivityArgs): ActivityTracker
}
