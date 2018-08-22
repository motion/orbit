import * as React from 'react'
import { SizedSurface, SizedSurfaceProps } from './SizedSurface'

export type ButtonProps = SizedSurfaceProps &
  React.HTMLAttributes<HTMLButtonElement>

const buttonStyles = {
  outline: 0,
  cursor: 'default',
}

export const Button = ({
  badge,
  children,
  theme,
  chromeless,
  type,
  glow,
  glowProps,
  badgeProps,
  elementProps,
  style,
  ...props
}: ButtonProps) => {
  return (
    <SizedSurface
      tagName="button"
      style={{ ...buttonStyles, ...style }}
      elementProps={{
        justifyContent: 'center',
        ...elementProps,
      }}
      type={type}
      clickable
      hoverable
      sizeFont
      sizePadding
      sizeRadius
      sizeHeight
      sizeLineHeight
      justifyContent="center"
      borderWidth={1}
      chromeless={chromeless}
      glow={glow}
      glint
      theme={theme}
      glowProps={{
        scale: 1.8,
        opacity: 0.15,
        ...glowProps,
      }}
      {...props}
    >
      {children}
    </SizedSurface>
  )
}
