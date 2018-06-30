```ts
import { view, on } from 'black'

// this adds type safety and removes hard to find this.* stuff

// 1. remove this.subscriptions being added automatically by views
// 2. on just adds hidden subscriptions on the view if used
// 3. on passes through the value it receives

@view
class SomeView extends Component {
  componentDidMount() {
    // adds removeEventListener in unmount
    on(this, window.addEventListener('scroll', this.onScroll))
    // adds clearTimeout in unmount
    on(this, setTimeout(this, () => {}, 1000))
  }

  render() {}
}
```
