import { Oracle } from '@mcro/oracle'
import { getGlobalConfig } from '@mcro/config'

// handles the oracle, which includes OCR and screen watching

export class OracleManager {
  private isStarted = false
  private oracle: Oracle

  constructor() {
    this.oracle = new Oracle({
      port: getGlobalConfig().ports.ocrBridge,
      onMessage: (action, value) => {
        console.log('got', action, value)
      },
    })
  }

  async start() {
    await this.oracle.start()
    console.log('start oracle manager', this.isStarted, !!this.oracle)
  }
}
