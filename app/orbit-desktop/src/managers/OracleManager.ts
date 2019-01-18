import { getGlobalConfig } from '@mcro/config'
import { Oracle, OracleMessageHandler } from '@mcro/oracle'
import { App, Desktop } from '@mcro/stores'

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
    console.log('message', message)
    switch (message) {
      case 'trayBounds':
        Desktop.setState({ operatingSystem: { trayBounds: value } })
        break
      case 'trayClicked':
      case 'trayHovered':
        // @ts-ignore
        Desktop.sendMessage(App, App.messages.TRAY_EVENT, { type: message, value: value.id })
        break
    }
  }
}
