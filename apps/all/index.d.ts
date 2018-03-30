interface RequestIdleCallbackHandle {}
interface RequestIdleCallbackOptions {
  timeout: number
}
interface RequestIdleCallbackDeadline {
  readonly didTimeout: boolean
  timeRemaining: (() => number)
}

declare global {
  interface Window {
    requestIdleCallback: ((
      callback: ((deadline: RequestIdleCallbackDeadline) => void),
      opts?: RequestIdleCallbackOptions,
    ) => RequestIdleCallbackHandle)
    cancelIdleCallback: ((handle: RequestIdleCallbackHandle) => void)
  }
}
