import * as React from 'react'
import { SizedSurface, SizedSurfaceProps } from './SizedSurface'

export type ButtonProps = SizedSurfaceProps & React.HTMLAttributes<HTMLButtonElement>

const buttonStyles = {
  outline: 0,
  cursor: 'default',
}

const selectFromPrefix = (o: Object, prefix?: string) => {
  const len = prefix.length
  const o1 = o
  for (const key in o) {
    if (key.indexOf(prefix) === 0) {
      const newKey = key.slice(len)
      const newKeyCamelCase = `${newKey[0].toLowerCase()}${newKey.slice(1)}`
      o1[newKeyCamelCase] = o[key]
    }
  }
  return o1
}

const buttonThemeSelect = theme => {
  return selectFromPrefix(theme, 'button')
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
  opacity,
  disabled,
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
      themeSelect={buttonThemeSelect}
      opacity={disabled ? 0.5 : opacity || 1}
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
