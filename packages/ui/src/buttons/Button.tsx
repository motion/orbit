import { forwardTheme, useTheme } from '@o/gloss'
import { selectDefined } from '@o/utils'
import React, { forwardRef, useContext } from 'react'
import { UIContext } from '../helpers/contexts'
import { SizedSurface, SizedSurfaceProps } from '../SizedSurface'

export type ButtonProps = React.HTMLAttributes<HTMLButtonElement> &
  SizedSurfaceProps & {
    acceptsHovered?: boolean
  }

const glowProps = {
  scale: 1.8,
  opacity: 0.15,
}

const activeStyle = {
  opacity: 0.8,
}

function ButtonInner({
  badge,
  children,
  chromeless,
  type,
  glow,
  badgeProps,
  elementProps,
  opacity,
  disabled,
  forwardRef,
  ...props
}: ButtonProps) {
  const theme = useTheme()
  return (
    <SizedSurface
      forwardRef={forwardRef}
      themeSelect="button"
      tagName="button"
      alignItems="center"
      flexFlow="row"
      WebkitAppRegion="no-drag"
      outline="0"
      cursor="default"
      elementProps={elementProps}
      type={type}
      clickable
      sizeFont
      sizePadding
      sizeRadius
      sizeHeight
      sizeLineHeight
      justifyContent="center"
      borderWidth={selectDefined(theme.borderWidth, 1)}
      chromeless={chromeless}
      glow={glow}
      glint
      opacity={disabled ? 0.5 : opacity}
      pointerEvents={disabled ? 'none' : undefined}
      activeStyle={activeStyle}
      glowProps={glowProps}
      {...props}
    >
      {children}
    </SizedSurface>
  )
}

export const Button = forwardRef(function Button(props: ButtonProps, ref) {
  const uiContext = useContext(UIContext)

  let element = null
  if (props.acceptsHovered && typeof uiContext.hovered === 'boolean') {
    element = <ButtonInner hover={uiContext.hovered} forwardRef={ref} {...props} />
  } else {
    element = <ButtonInner forwardRef={ref} {...props} />
  }

  return forwardTheme({ children: element, theme: props.theme })
})
