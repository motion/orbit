import { getGlobalConfig } from '@o/config'
import { Logger } from '@o/kit'
import { Oracle, OracleMessageHandler, OracleMessages } from '@o/oracle'
import { Desktop } from '@o/stores'

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

  handleMessage: OracleMessageHandler = (message, value) => {
    log.info('message', message)
    switch (message) {
      case OracleMessages.trayBounds:
        Desktop.setState({ operatingSystem: { trayBounds: value } })
        break
      case OracleMessages.trayClicked:
      case OracleMessages.trayHovered:
        // Desktop.sendMessage(App, App.messages.TRAY_EVENT, { type: message, value: value.id })
        break
    }
  }
}
