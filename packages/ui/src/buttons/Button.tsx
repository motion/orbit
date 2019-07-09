import { isDefined, selectDefined } from '@o/utils'
import { Theme, useTheme } from 'gloss'
import React, { forwardRef, memo, useCallback } from 'react'

import { useUncontrolled } from '../helpers/useUncontrolled'
import { SizedSurface, SizedSurfaceProps } from '../SizedSurface'
import { useSurfaceProps } from '../Surface'

export type ButtonProps = React.HTMLAttributes<HTMLButtonElement> &
  SizedSurfaceProps & {
    /** force button not to apply hover styles */
    ignoreHover?: boolean

    /** use defaultActive/onChangeActive for easy active on/off */
    onChangeActive?: (next: boolean) => any

    defaultActive?: boolean
  }

const glowProps = {
  scale: 1.8,
  opacity: 0.15,
}

const activeStyle = {
  opacity: 0.8,
}

const ButtonInner = forwardRef((props: ButtonProps, ref) => {
  const theme = useTheme()
  return (
    <SizedSurface
      ref={ref}
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
      onClick={useCallback(() => {
        if (isDefined(props.active) && props.onChangeActive) {
          props.onChangeActive(!props.active)
        }
      }, [props.onChangeActive, props.active])}
      {...props}
    />
  )
})

export const Button = memo(
  forwardRef((buttonProps: ButtonProps, ref) => {
    const props = useSurfaceProps(buttonProps)
    const { alt, theme, themeSelect, ...rest } = props
    const controlledProps = useUncontrolled(rest, {
      active: 'onChangeActive',
    })
    return (
      <Theme themeSelect={themeSelect} alt={alt} theme={theme}>
        <ButtonInner ref={ref} {...rest} {...controlledProps} />
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
