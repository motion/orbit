import { Base, gloss } from 'gloss'

export const Circle = gloss<{ size?: number; background?: any }>(Base, {
  position: 'relative',
  borderRadius: 1000,
  lineHeight: '1rem',
  alignItems: 'center',
  justifyContent: 'center',
  background: '#fff',
  fontWeight: 400,
  cursor: 'pointer',
  userSelect: 'none',
}).theme(p => ({
  width: p.size,
  height: p.size,
  background: p.background,
  borderRadius: p.size,
}))

Circle.defaultProps = {
  size: 20,
}
