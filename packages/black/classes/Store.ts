import { CompositeDisposable } from 'event-kit'

export class Store {
  private compositeDisposable = null

  get subscriptions() {
    if (!this.compositeDisposable) {
      this.compositeDisposable = new CompositeDisposable()
    }
    return this.compositeDisposable
  }
}
