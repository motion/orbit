import * as React from 'react'
import { SizedSurface, SizedSurfaceProps } from './SizedSurface'

export type ButtonProps = SizedSurfaceProps &
  React.HTMLAttributes<HTMLButtonElement>

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
  ...props
}: ButtonProps) => {
  return (
    <SizedSurface
      tagName="button"
      style={{
        outline: 0,
        cursor: 'default',
      }}
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
      glowProps={{
        scale: 1.8,
        draggable: false,
        opacity: 0.15,
        ...glowProps,
        ...(theme && theme.glow),
      }}
      {...props}
    >
      {children}
    </SizedSurface>
  )
}
