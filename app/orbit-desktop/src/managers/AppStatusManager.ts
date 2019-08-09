import { WindowMessage } from '@o/models'
import { isDefined } from '@o/ui'
import Observable from 'zen-observable'

export class AppStatusManager {
  update = new Map<number, { update: (next: any) => void; observable: Observable<WindowMessage> }>()

  observe(windowId?: number) {
    if (this.update.has(windowId)) {
      return this.update.get(windowId).observable
    }
    const observable = new Observable<WindowMessage>(observer => {
      this.update.set(windowId, {
        update: (status: WindowMessage) => {
          observer.next(status)
        },
        observable,
      })
    })
    return observable
  }

  sendMessage(message: WindowMessage) {
    for (const [updateWindowId, callback] of this.update) {
      if (isDefined(message.windowId) && message.windowId !== updateWindowId) {
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
