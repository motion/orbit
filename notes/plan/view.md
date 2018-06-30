```ts
import { view } from 'black'
// move to capitals for stores/views (class exports should all be capital)
import { MyStore } from './MyStore'

// give us types and improve consistency
// also capitals for stores in code is nice to distinguish

// 1. default to not-naming stores
// 2. encourage common practice passing one store at a time which shows how to nest them easily

@view.provide(MyStore)
@view.provide(OtherStore)
@view
class View extends React.Component {
  render({ MyStore, OtherStore }) {
    // further down...
    return <SomeSubView />
  }
}

// gives us types
@view.attach(MyStore)
@view
class SomeSubView extends React.Component {
  render() {
    // ...
  }
}
```
