import { CompositeDisposable, Emitter } from 'event-kit'
import { automagicClass } from '@mcro/automagical'

export class Store {
  private _emitter
  private _subscriptions
  private _emit

  constructor() {
    this.setupSubscribables()
  }

  // handle HMR by re-setting up some thing on re-mount
  setupSubscribables() {
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
