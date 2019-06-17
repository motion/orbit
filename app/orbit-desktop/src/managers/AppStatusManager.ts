import { AppStatusMessage } from '@o/models'
import { isDefined } from '@o/ui'
import Observable from 'zen-observable'

class AppStatusManager {
  update = new Map<
    number,
    { update: (next: any) => void; observable: Observable<AppStatusMessage> }
  >()

  observe(appId?: number) {
    if (this.update.has(appId)) {
      return this.update.get(appId).observable
    }
    const observable = new Observable<AppStatusMessage>(observer => {
      const update = (status: AppStatusMessage) => {
        if (status.appId === appId) {
          observer.next(status)
        }
      }
      this.update.set(appId, {
        update,
        observable,
      })
      // start with empty
      observer.next(null)
    })
    return observable
  }

  sendMessage(message: AppStatusMessage, appId?: number) {
    for (const [updateAppId, callback] of this.update) {
      if (isDefined(appId) && appId !== updateAppId) {
        continue
      }
      callback.update(message)
    }
  }
}

export const appStatusManager = new AppStatusManager()

export const appStatus = {
  error: (id: string, message: string) =>
    appStatusManager.sendMessage({ type: 'error', message, id }),
  warn: (id: string, message: string) =>
    appStatusManager.sendMessage({ type: 'warn', message, id }),
  info: (id: string, message: string) =>
    appStatusManager.sendMessage({ type: 'info', message, id }),
  success: (id: string, message: string) =>
    appStatusManager.sendMessage({ type: 'success', message, id }),
}
