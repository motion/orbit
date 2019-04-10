import { gloss } from '@o/gloss'
import { SizedSurface, SizedSurfaceProps } from '../SizedSurface'

export const Message = gloss<SizedSurfaceProps>(SizedSurface, {
  userSelect: 'text',
  lineHeight: '1.4rem',
  cursor: 'text',
  whiteSpace: 'normal',
  width: '100%',
})

Message.defaultProps = {
  className: 'text',
  hoverStyle: false,
  pad: 'sm',
  sizeRadius: true,
}
