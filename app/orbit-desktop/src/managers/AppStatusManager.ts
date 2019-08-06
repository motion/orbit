import { AppStatusMessage } from '@o/models'
import { isDefined } from '@o/ui'
import Observable from 'zen-observable'

export class AppStatusManager {
  update = new Map<
    number,
    { update: (next: any) => void; observable: Observable<AppStatusMessage> }
  >()

  observe(appId?: number) {
    if (this.update.has(appId)) {
      return this.update.get(appId).observable
    }
    const observable = new Observable<AppStatusMessage>(observer => {
      this.update.set(appId, {
        update: (status: AppStatusMessage) => {
          observer.next(status)
        },
        observable,
      })
    })
    return observable
  }

  sendMessage(message: AppStatusMessage) {
    for (const [updateAppId, callback] of this.update) {
      if (isDefined(message.appId) && message.appId !== updateAppId) {
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
