import * as React from 'react'
import { SizedSurface, SizedSurfaceProps } from './SizedSurface'
import { UIContext } from './helpers/contexts'

export type ButtonProps = SizedSurfaceProps &
  React.HTMLAttributes<HTMLButtonElement> & {
    acceptsHovered?: boolean
  }

const buttonStyles = {
  outline: 0,
  cursor: 'default',
}

const ButtonInner = ({
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
  opacity,
  disabled,
  ...props
}: ButtonProps) => {
  return (
    <SizedSurface
      themeSelect="button"
      tagName="button"
      alignItems="center"
      flexFlow="row"
      style={{ WebkitAppRegion: 'no-drag', ...buttonStyles, ...style }}
      elementProps={{
        justifyContent: 'center',
        ...elementProps,
      }}
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
      theme={theme}
      opacity={disabled ? 0.5 : opacity}
      pointerEvents={disabled ? 'none' : undefined}
      activeStyle={{
        opacity: 0.8,
      }}
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

export const Button = React.forwardRef((props: ButtonProps, ref) => {
  const uiContext = React.useContext(UIContext)

  if (props.acceptsHovered && typeof uiContext.hovered === 'boolean') {
    return <ButtonInner hover={uiContext.hovered} forwardRef={ref} {...props} />
  }

  return <ButtonInner forwardRef={ref} {...props} />
})
