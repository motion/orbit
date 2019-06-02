import React, { memo } from 'react'

import { Scale } from './Scale'
import { getSpaceSize } from './Space'
import { SimpleText, SimpleTextProps } from './text/SimpleText'
import { Col, ColProps } from './View/Col'

type IconLabeledProps = ColProps & {
  icon?: React.ReactNode
  label?: string
  labelProps?: SimpleTextProps
  subTitle?: string
  subTitleProps?: SimpleTextProps
}

export const IconLabeled = memo(
  ({ icon, label, labelProps, subTitle, size, subTitleProps, ...restProps }: IconLabeledProps) => {
    const spaceSize = getSpaceSize(size)
    return (
      <Scale size={size}>
        <Col space="xs" alignItems="center" justifyContent="center" {...restProps}>
          <Col
            marginTop="md"
            marginBottom="sm"
            alignItems="center"
            position="relative"
            width={spaceSize * 48}
            height={spaceSize * 48}
          >
            {icon}
          </Col>
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
        </Col>
      </Scale>
    )
  },
)
