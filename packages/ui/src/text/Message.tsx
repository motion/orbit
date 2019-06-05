import { gloss } from 'gloss'

import { SizedSurface, SizedSurfaceProps } from '../SizedSurface'

export const Message = gloss<SizedSurfaceProps>(SizedSurface, {
  userSelect: 'text',
  cursor: 'text',
  width: '100%',
})

Message.defaultProps = {
  sizeLineHeight: 1.35,
  className: 'ui-message',
  hoverStyle: false,
  activeStyle: false,
  flexDirection: 'row',
  pad: 'sm',
  spaceSize: 'lg',
  sizeRadius: true,
  sizeIcon: 2,
  elementProps: {
    display: 'block',
    whiteSpace: 'normal',
  },
}
