import { Oracle } from '@mcro/oracle'

// handles the oracle, which includes OCR and screen watching

export class OracleManager {
  private isStarted = false
  private oracle: Oracle

  constructor({ oracle }: { oracle: Oracle }) {
    this.oracle = oracle
  }

  start = () => {
    this.isStarted = true
    console.log('ok', this.isStarted, !!this.oracle)
  }
}
