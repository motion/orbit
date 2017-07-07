import React from 'react'
import SizedSurface from './sizedSurface'
import injectTheme from './helpers/injectTheme'
import { inject } from 'react-tunnel'

const Button = injectTheme(
  ({ uiContext, badge, children, theme, type, glowProps, ...props }) => {
    if (type === 'submit' && uiContext && uiContext.inForm) {
      const ogClick = props.onClick
      props.onClick = () => {
        uiContext.form.submit()
        ogClick && ogClick()
      }
    }

    return (
      <SizedSurface
        tagName="button"
        type={type}
        sizeRadius
        sizeFont
        sizeHeight
        sizePadding
        borderWidth={1}
        glint
        row
        align="center"
        glow
        glowProps={{
          scale: 2,
          ...glowProps,
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
  }
)

Button.acceptsHovered = true

export default inject(context => ({ uiContext: context.uiContext }))(Button)
