import { CompositeDisposable, Emitter } from 'event-kit'
import { automagicClass } from '@mcro/automagical'

// disabling for now because i'm getting a "Emitter has been disposed" error on HMR

export class Store {
  // emitter: Emitter
  // emit: Emitter['emit']
  // subscriptions: CompositeDisposable

  private _emitter: Emitter
  private _subscriptions: CompositeDisposable
  private _emit: Emitter['emit']

  constructor() {
    this.setupSubscribables()
  }

  // handle HMR by re-setting up some thing on re-mount
  setupSubscribables() {
    if (this._subscriptions && !this._subscriptions.disposed) {
      this._subscriptions.dispose()
    }
    this._emitter = new Emitter()
    this._subscriptions = new CompositeDisposable()
    this._emit = this.emitter.emit.bind(this.emitter)
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
