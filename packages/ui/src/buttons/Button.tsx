import { forwardTheme, useTheme } from '@o/gloss'
import { selectDefined } from '@o/utils'
import React, { forwardRef, useContext } from 'react'
import { UIContext } from '../helpers/contexts'
import { IconProps } from '../Icon'
import { SizedSurface, SizedSurfaceProps } from '../SizedSurface'
import { useSurfaceProps } from '../Surface'

export type ButtonProps = React.HTMLAttributes<HTMLButtonElement> &
  SizedSurfaceProps & {
    ignoreHover?: boolean
    iconProps?: Partial<IconProps>
  }

const glowProps = {
  scale: 1.8,
  opacity: 0.15,
}

const activeStyle = {
  opacity: 0.8,
}

function ButtonInner(buttonProps: ButtonProps) {
  const theme = useTheme()
  const props = useSurfaceProps(buttonProps)
  return (
    <SizedSurface
      themeSelect="button"
      borderPosition="inside"
      tagName="button"
      alignItems="center"
      flexDirection="row"
      WebkitAppRegion="no-drag"
      outline="0"
      cursor="default"
      clickable
      sizeFont
      sizePadding
      sizeRadius
      sizeHeight
      sizeLineHeight
      justifyContent="center"
      borderWidth={selectDefined(theme.borderWidth, 1)}
      // elevation={selectDefined(props.elevation, props.chromeless ? 0 : 1)}
      glint
      glintBottom
      pointerEvents={props.disabled ? 'none' : undefined}
      activeStyle={activeStyle}
      glowProps={glowProps}
      {...props}
    />
  )
}

export const Button = forwardRef(function Button(props: ButtonProps, ref) {
  const uiContext = useContext(UIContext)

  let element = null
  if (props.ignoreHover !== false && typeof uiContext.hovered === 'boolean') {
    element = <ButtonInner hover={uiContext.hovered} forwardRef={ref} {...props} />
  } else {
    element = <ButtonInner forwardRef={ref} {...props} />
  }

  return forwardTheme({ children: element, theme: props.theme })
})
