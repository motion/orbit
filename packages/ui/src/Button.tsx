import * as React from 'react'
import { UIContext } from './helpers/contexts'
import { SizedSurface, SizedSurfaceProps } from './SizedSurface'

export type ButtonProps = SizedSurfaceProps &
  React.HTMLAttributes<HTMLButtonElement> & {
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
      borderWidth={1}
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

export const Button = React.forwardRef(function Button(props: ButtonProps, ref) {
  const uiContext = React.useContext(UIContext)

  if (props.acceptsHovered && typeof uiContext.hovered === 'boolean') {
    return <ButtonInner hover={uiContext.hovered} forwardRef={ref} {...props} />
  }

  return <ButtonInner forwardRef={ref} {...props} />
})
