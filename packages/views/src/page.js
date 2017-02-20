import { view } from 'my-decorators'

export default view('page', {
  padding: 10,
})

console.log(view('page', {
  padding: 10,
}))

