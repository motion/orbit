import { Oracle } from '@mcro/oracle'

// handles the oracle, which includes OCR and screen watching

export class OracleManager {
  private isStarted = false
  private oracle: Oracle

  constructor() {
    this.oracle = new Oracle()
  }

  async start() {
    await this.oracle.start()
    console.log('start oracle manager', this.isStarted, !!this.oracle)
  }
}
