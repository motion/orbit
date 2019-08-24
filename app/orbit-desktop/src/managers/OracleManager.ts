import { getGlobalConfig } from '@o/config'
import { Logger, resolveObserveMany } from '@o/kit'
import { OracleWordsFound, OracleWordsFoundModel } from '@o/models'
import { Oracle, OracleMessageHandler, OracleMessages } from '@o/oracle'
import { Desktop } from '@o/stores'
import Observable from 'zen-observable'

// handles the oracle, which includes OCR and screen watching
const log = new Logger('OracleManager')

export class OracleManager {
  private oracle: Oracle

  constructor() {
    this.oracle = new Oracle({
      port: getGlobalConfig().ports.ocrBridge,
      onMessage: this.handleMessage,
    })
  }

  async start() {
    await this.oracle.start()
  }

  async stop() {
    await this.oracle.stop()
  }

  handleMessage: OracleMessageHandler = ({ message, value }) => {
    log.info('message', message, value)
    switch (message) {
      case OracleMessages.words:
        for (const observer of this.wordObservers) {
          observer.update(value)
        }
        break
      case OracleMessages.trayBounds:
        Desktop.setState({ operatingSystem: { trayBounds: value } })
        break
      case OracleMessages.trayClicked:
        Desktop.setState({ operatingSystem: { trayClicked: Date.now() } })
        break
      case OracleMessages.trayHovered:
        Desktop.setState({ operatingSystem: { trayHovered: Date.now() } })
        break
    }
  }

  wordObservers = new Set<{
    update: (next: OracleWordsFound[]) => void
    observable: Observable<OracleWordsFound[]>
  }>()
  observeWordsFound() {
    const observable = new Observable<OracleWordsFound[]>(observer => {
      this.wordObservers.add({
        update: (status: OracleWordsFound[]) => {
          observer.next(status)
        },
        observable,
      })
    })
    return observable
  }

  getResolvers() {
    return [
      resolveObserveMany(OracleWordsFoundModel, () => {
        return this.observeWordsFound()
      }),
    ]
  }
}
