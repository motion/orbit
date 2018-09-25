import { view } from '@mcro/black'

export const Circle = view({
  position: 'relative',
  borderRadius: 1000,
  lineHeight: '1rem',
  alignItems: 'center',
  justifyContent: 'center',
  background: '#fff',
  fontWeight: 400,
  cursor: 'pointer',
  userSelect: 'none',
}).theme(({ size, background }) => ({
  circle: {
    width: size,
    height: size,
    background,
    borderRadius: size,
  },
}))
