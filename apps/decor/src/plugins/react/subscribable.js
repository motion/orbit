import { CompositeDisposable } from 'sb-event-kit'

export default options => ({
  name: 'subscribable',
  mixin: {
    componentWillMount() {
      this.subscriptions = new CompositeDisposable()
    },
    componentWillUnmount() {
      this.subscriptions.dispose()
    },
  },
})
