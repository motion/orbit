import { CompositeDisposable, Emitter } from 'event-kit'
import { automagicClass } from '@mcro/automagical'

export class Store {
  private _subscriptions = new CompositeDisposable()
  private _emitter = new Emitter()
  private _emit = this.emitter.emit.bind(this.emitter)

  constructor() {
    this.subscriptions.add(this.emitter)
  }

  // getters because @store decorator checks for existence on prototype
  // so we need to define on prototype to avoid conflicts

  get emit() {
    return this._emit
  }

  get emitter() {
    return this._emitter
  }

  get subscriptions() {
    return this._subscriptions
  }

  get automagic() {
    return automagicClass
  }
}
