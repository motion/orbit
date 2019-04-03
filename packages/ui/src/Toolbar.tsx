import { Col, gloss } from '@o/gloss'
import { View, ViewProps } from './View/View'

export const Spacer = gloss(Col, {
  flexGrow: 1,
})

export type ToolbarProps = ViewProps

export const Toolbar = gloss<ToolbarProps>(View, {
  flexFlow: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: 20,
  width: '100%',
}).theme((props, theme) => ({
  background: props.background || theme.backgroundStronger,
}))
