import * as React from 'react'
import * as UI from '@mcro/ui'

const roundTheme = theme => ({
  ...theme,
  base: {
    ...theme.base,
    background: theme.base.background.darken(0.02),
    color: theme.base.color.alpha(0.6),
  },
})

export const RoundButton = props => (
  <UI.Button
    sizeRadius={100}
    borderWidth={0}
    fontWeight={300}
    display="inline-flex"
    themeAdjust={roundTheme}
    {...props}
  />
)
