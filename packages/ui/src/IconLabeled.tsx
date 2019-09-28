import React, { memo } from 'react'

import { Icon, IconProps } from './Icon'
import { Scale } from './Scale'
import { getSize } from './Sizes'
import { SimpleText, SimpleTextProps } from './text/SimpleText'
import { Stack, StackProps } from './View/Stack'

export type IconLabeledProps = StackProps & {
  icon?: React.ReactNode
  label?: string
  labelProps?: SimpleTextProps
  subTitle?: string
  subTitleProps?: SimpleTextProps
  iconProps?: IconProps
}

export const IconLabeled = memo(
  ({
    icon,
    label,
    labelProps,
    subTitle,
    size = 1,
    subTitleProps,
    iconProps,
    ...restProps
  }: IconLabeledProps) => {
    const sizeNum = getSize(size)
    return (
      <Scale size={size}>
        <Stack flex={1} padding space alignItems="center" justifyContent="center" {...restProps}>
          <Stack marginTop="md" marginBottom="sm" alignItems="center" position="relative">
            {typeof icon === 'string' ? (
              <Icon name={icon} size={sizeNum * 48} {...iconProps} />
            ) : (
              icon
            )}
          </Stack>
          <Stack alignItems="center" justifyContent="center" space="xs">
            {!!label && (
              <SimpleText ellipse fontWeight={500} size={0.9} {...labelProps}>
                {label}
              </SimpleText>
            )}
            {!!subTitle && (
              <SimpleText ellipse alpha={0.7} size={0.85} {...subTitleProps}>
                {subTitle}
              </SimpleText>
            )}
          </Stack>
        </Stack>
      </Scale>
    )
  },
)
