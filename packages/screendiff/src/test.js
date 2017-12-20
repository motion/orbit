import { screen } from './index'

const x = screen({
  destination: '/tmp/screen2.png',
  bounds: [1000, 1000],
  offset: [100, 100],
})

console.log(x)
