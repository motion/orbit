import { Theme, useTheme } from '@o/gloss'
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
    someNewProp?: string
  }

const glowProps = {
  scale: 1.8,
  opacity: 0.15,
}

const activeStyle = {
  opacity: 0.8,
}

function ButtonInner(props: ButtonProps) {
  const theme = useTheme()
  return (
    <SizedSurface
      borderPosition="inside"
      userSelect="none"
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
      glint
      glintBottom
      pointerEvents={props.disabled ? 'none' : undefined}
      activeStyle={activeStyle}
      glowProps={glowProps}
      {...props}
    />
  )
}

export const Button = forwardRef((buttonProps: ButtonProps, ref) => {
  const props = useSurfaceProps(buttonProps)
  const { alt, theme, themeSelect = 'button', ...rest } = props
  const uiContext = useContext(UIContext)

  let element = null
  if (props.ignoreHover !== false && typeof uiContext.hovered === 'boolean') {
    element = <ButtonInner hover={uiContext.hovered} forwardRef={ref} {...rest} />
  } else {
    element = <ButtonInner forwardRef={ref} {...rest} />
  }

  return (
    <Theme themeSelect={themeSelect} alt={alt} theme={theme}>
      {element}
    </Theme>
  )
})
