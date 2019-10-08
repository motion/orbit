import { isDefined, selectDefined } from '@o/utils'
import { Theme } from 'gloss'
import React, { memo, useCallback, useMemo } from 'react'

import { memoIsEqualDeep } from '../helpers/memoHelpers'
import { useUncontrolled } from '../helpers/useUncontrolled'
import { Surface, SurfaceProps } from '../Surface'
import { useSurfaceProps } from '../SurfacePropsContext'

export type ButtonProps = React.HTMLAttributes<HTMLButtonElement> &
  SurfaceProps & {
    /** force button not to apply hover styles */
    ignoreHover?: boolean

    /** use defaultActive/onChangeActive for easy active on/off */
    onChangeActive?: (next: boolean) => any

    defaultActive?: boolean
  }

export const Button = memoIsEqualDeep((direct: ButtonProps) => {
  const props = useSurfaceProps(direct)
  const { coat, theme, subTheme = 'button', ...rest } = props
  const controlledProps = useUncontrolled(rest, {
    active: 'onChangeActive',
  })
  return (
    <Theme subTheme={subTheme} coat={coat} theme={theme}>
      <Surface
        data-is="Button"
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
        borderWidth={useCallback(theme => selectDefined(theme.borderWidth, 1), [])}
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
        {...rest}
        {...controlledProps}
      />
    </Theme>
  )
})

Button['acceptsProps'] = {
  hover: true,
}

const glowProps = {
  scale: 1.8,
  opacity: 0.15,
}

const activeStyle = {
  opacity: 0.8,
}
