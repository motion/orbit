import React from 'react'
import SizedSurface from './sizedSurface'
import injectTheme from './helpers/injectTheme'

const Button = injectTheme(({ badge, children, theme, ...props }) =>
  <SizedSurface
    tagName="button"
    borderWidth={1}
    glint
    row
    align="center"
    glow
    glowProps={{
      scale: 2,
    }}
    background={theme.base.buttonBackground}
    {...props}
    noElement
  >
    {children}
    {badge &&
      <badge>
        {badge}
      </badge>}
  </SizedSurface>
)

Button.acceptsHovered = true

export default Button
