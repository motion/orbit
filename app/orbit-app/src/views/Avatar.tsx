import { view } from '@mcro/black'

export const Avatar = view('img', {
  borderRadius: 100,
  width: 70,
  height: 70,
  margin: [10, 0],
  position: 'absolute',
  top: -22,
  right: -22,
  transform: {
    scale: 1,
    rotate: '40deg',
  },
})
