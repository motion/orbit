import { isDefined, selectDefined } from '@o/utils'
import { Theme, useTheme } from 'gloss'
import React, { memo, useCallback } from 'react'

import { memoIsEqualDeep } from '../helpers/memoHelpers'
import { useUncontrolled } from '../helpers/useUncontrolled'
import { SizedSurface, SizedSurfaceProps } from '../SizedSurface'
import { useSurfaceProps } from '../SizedSurfacePropsContext'

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

const ButtonInner = (props: ButtonProps) => {
  const theme = useTheme()
  return (
    <SizedSurface
      borderPosition="inside"
      userSelect="none"
      tagName="button"
      alignItems="center"
      flexDirection="row"
      WebkitAppRegion="no-drag"
      // glow
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
}

export const Button = memoIsEqualDeep((buttonProps: ButtonProps) => {
  const props = useSurfaceProps(buttonProps)
  const { alt, theme, subTheme, ...rest } = props
  const controlledProps = useUncontrolled(rest, {
    active: 'onChangeActive',
  })
  return (
    <Theme subTheme={subTheme} alt={alt} theme={theme}>
      <ButtonInner {...rest} {...controlledProps} />
    </Theme>
  )
})

Button['defaultProps'] = {
  subTheme: 'button',
}

Button['acceptsProps'] = {
  hover: true,
}
