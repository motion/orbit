import { getGlobalConfig } from '@o/config'
import { Oracle, OracleMessageHandler } from '@o/oracle'
import { Desktop } from '@o/stores'

// handles the oracle, which includes OCR and screen watching

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
    // console.log('message', message)
    switch (message) {
      case 'trayBounds':
        Desktop.setState({ operatingSystem: { trayBounds: value } })
        break
      case 'trayClicked':
      case 'trayHovered':
        // Desktop.sendMessage(App, App.messages.TRAY_EVENT, { type: message, value: value.id })
        break
    }
  }
}
