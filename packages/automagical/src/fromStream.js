import { computed, observable, action, runInAction } from 'mobx'

function observableSymbol() {
  return (typeof Symbol === 'function' && Symbol.observable) || '@@observable'
}

function self() {
  return this
}

export function toStream(expression) {
  const computedValue = computed(expression)
  return {
    subscribe(observer) {
      return {
        unsubscribe: computedValue.observe(
          typeof observer === 'function'
            ? ({ newValue }) => observer(newValue)
            : ({ newValue }) => observer.next(newValue)
        ),
      }
    },
    [observableSymbol()]: self,
  }
}

class StreamListener {
  @observable.ref currentValue = undefined
  @observable currentVersion = 0

  @computed
  get current() {
    this.currentVersion
    return this.currentValue
  }

  constructor(observable, initialValue) {
    runInAction(() => {
      this.currentValue = initialValue
      this.subscription = observable.subscribe(this)
    })
  }

  dispose() {
    if (this.subscription) {
      this.subscription.unsubscribe()
    }
  }

  @action
  next(value) {
    this.currentValue = value
    this.currentVersion++
  }

  @action
  complete() {
    this.dispose()
  }

  @action
  error(value) {
    this.currentValue = value
    this.dispose()
  }
}

export default function fromStream(observable, initialValue = undefined) {
  return new StreamListener(observable, initialValue)
}
