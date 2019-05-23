import { Theme, useTheme } from 'gloss'
import { selectDefined } from '@o/utils'
import React, { forwardRef, memo } from 'react'

import { SizedSurface, SizedSurfaceProps } from '../SizedSurface'
import { useSurfaceProps } from '../Surface'

export type ButtonProps = React.HTMLAttributes<HTMLButtonElement> &
  SizedSurfaceProps & {
    /** force button not to apply hover styles */
    ignoreHover?: boolean
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
      borderStyle="solid"
      cursor="default"
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

export const Button = memo(
  forwardRef((buttonProps: ButtonProps, ref) => {
    const props = useSurfaceProps(buttonProps)
    const { alt, theme, themeSelect, ...rest } = props
    return (
      <Theme themeSelect={themeSelect} alt={alt} theme={theme}>
        <ButtonInner forwardRef={ref} {...rest} />
      </Theme>
    )
  }),
)

Button['defaultProps'] = {
  themeSelect: 'button',
}

Button['acceptsProps'] = {
  hover: true,
}
