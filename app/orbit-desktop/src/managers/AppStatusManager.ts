import Observable from 'zen-observable'
import { AppStatusMessage } from '@o/models'

export class AppStatusManager {
  update = new Set<(next: any) => void>()

  observe(appId?: number) {
    return new Observable<AppStatusMessage>(observer => {
      this.update.add((status: AppStatusMessage) => {
        if (status.appId === appId) {
          observer.next(status)
        }
      })
    })
  }

  sendMessage(message: AppStatusMessage) {
    ;[...this.update].forEach(fn => {
      fn(message)
    })
  }
}
