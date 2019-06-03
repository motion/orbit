import { AppBit } from '@o/models'
import { IconProps } from '@o/ui'
import React, { forwardRef, memo } from 'react'

import { useAppDefinition } from '../hooks/useAppDefinition'

export type AppIconProps = Partial<IconProps> & { app: AppBit }

// const idReplace = / id="([a-z0-9-_]+)"/gi

export const AppIcon = forwardRef(({ app, ...props }: AppIconProps, ref) => {
  const definition = useAppDefinition(app.identifier)
  const icon = definition.icon
  const isSVGIcon = icon.trim().slice(0, 10).indexOf('<svg') > -1
  const { colors } = app

  if (isSVGIcon) {
    return (

    )
  }

  return (
    <IconShape
      forwardRef={ref}
      background={app.colors[0]}
      color={app.colors[1]}
      name={app.identifier}
      size={48}
      {...props}
    />
  )
})

// @ts-ignore
AppIcon.acceptsProps = {
  hover: true,
  icon: true,
}
