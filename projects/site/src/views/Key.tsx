import { Button, gloss } from '@o/ui'

export const Key = gloss(Button, {
  display: 'inline',
  size: 'xs',
  glint: false,
  fontWeight: 600,
  // background: 'red', //theme => theme.background,
  hoverStyle: false,
  activeStyle: false,
  noInnerElement: true,
})
