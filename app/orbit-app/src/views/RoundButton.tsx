import * as React from 'react'
import * as UI from '@mcro/ui'

const roundTheme = theme => ({
  ...theme,
  base: {
    ...theme.base,
    background: theme.base.background.darken(0.02).alpha(0.2),
    color: theme.base.color.alpha(0.6),
  },
  hover: {
    background: theme.base.background.darken(0.02).alpha(0.1),
  },
})

export const RoundButton = props => (
  <UI.Button
    sizeRadius={100}
    glint={false}
    borderWidth={0}
    fontWeight={300}
    display="inline-flex"
    themeAdjust={roundTheme}
    {...props}
  />
)
